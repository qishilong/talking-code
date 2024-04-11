import { download, formatDate } from "@/utils/tool";
import { ExportOutlined, FileExcelOutlined, ImportOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { Button, Image, Modal, Popconfirm, Switch, Tag, Tooltip, message } from "antd";
import { Workbook } from "exceljs";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Access, useAccess } from "umi";

// 请求方法
import UserController from "@/services/user";

import styles from "./index.module.less";

function User() {
  const actionRef = useRef();
  const navigate = useNavigate();
  const access = useAccess();
  const id = useId();
  const inputRef = useRef();

  const [userInfo, setUserInfo] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });
  const [allUserData, setAllUserData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { initialState } = useModel("@@initialState");

  const columns = [
    {
      title: "序号",
      align: "center",
      width: "5%",
      search: false,
      render: (text, record, index) => {
        return [(pagination.current - 1) * pagination.pageSize + index + 1];
      }
    },
    {
      title: "登录账号",
      dataIndex: "loginId",
      key: "loginId",
      align: "center",
      width: "15%",
      render: (_, row) => {
        let text = "-";
        if (row?.loginId) {
          text = row.loginId;
        }
        return (
          <Tooltip
            title={
              row?.loginId ? <div className={styles["tooltip-styles"]}>{text}</div> : undefined
            }
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{text}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
      align: "center",
      width: "15%",
      render: (val, row) => {
        let text = "-";
        if (row?.nickname) {
          text = row.nickname;
        }
        return (
          <Tooltip
            title={
              row?.nickname.length > 0 ? (
                <div className={styles["tooltip-styles"]}>{text}</div>
              ) : undefined
            }
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{text}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "注册时间",
      dataIndex: "registerDate",
      key: "registerDate",
      align: "center",
      width: "15%",
      search: false,
      render: (val, row) => {
        if (val) {
          return formatDate(val);
        }
        return "-";
      }
    },
    {
      title: "上次登陆时间",
      dataIndex: "lastLoginDate",
      key: "lastLoginDate",
      align: "center",
      width: "15%",
      search: false,
      render: (val, row) => {
        if (val) {
          return formatDate(val);
        }
        return "-";
      }
    },
    {
      title: "当前积分",
      dataIndex: "points",
      key: "points",
      align: "center",
      width: "5%",
      render: (val, row) => {
        if (val) {
          return val;
        }
        return "-";
      }
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      valueType: "image",
      align: "center",
      search: false,
      width: "5%",
      render: (val, row) => {
        if (val) {
          return val;
        }
        return "-";
      }
    },
    {
      title: "账号状态",
      dataIndex: "enabled",
      key: "enabled",
      align: "center",
      search: false,
      width: "5%",
      render: (_, row, index, action) => {
        const defaultChecked = row.enabled ? true : false;
        return [
          <Switch
            key={row._id}
            defaultChecked={defaultChecked}
            size='small'
            onChange={(value) => switchChange(row, value)}
          />
        ];
      }
    },
    {
      title: "操作",
      width: "10%",
      key: "option",
      valueType: "option",
      fixed: "right",
      align: "center",
      render: (_, row, index, action) => {
        return [
          <div key={row._id} className={styles["handle-style"]}>
            <Button type='link' size='small' onClick={() => showModal(row)}>
              详情
            </Button>
            <Button type='link' size='small' onClick={() => navigate(`/user/editUser/${row._id}`)}>
              编辑
            </Button>
            <Access accessible={access.SuperAdmin}>
              <Popconfirm
                title='你确定要删除？'
                onConfirm={() => deleteHandle(row)}
                okText='删除'
                cancelText='取消'
              >
                <Button type='link' size='small' disabled={initialState.name === row.loginId}>
                  删除
                </Button>
              </Popconfirm>
            </Access>
          </div>
        ];
      }
    }
  ];

  /**
   * 删除用户
   * @param {*} userInfo 一条用户信息
   */
  async function deleteHandle(userInfo) {
    await UserController.deleteUser(userInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success("删除用户成功");
  }

  /**
   *
   * @param {*} page 当前页
   * @param {*} pageSize 每页条数
   */
  function handlePageChange(current, pageSize) {
    setPagination({
      current,
      pageSize
    });
  }

  /**
   * 修改用户的可用状态
   * @param {*} row 当前这一条管理员信息
   * @param {*} value 新的可用状态
   */
  async function switchChange(row, value) {
    // 不同于管理员，这里直接通过控制器来发请求
    await UserController.editUser(row._id, {
      enabled: value
    });
    if (value) {
      message.success("用户状态已激活");
    } else {
      message.success("该用户已被禁用");
    }
  }

  /**
   * 打开修改对话框
   */
  function showModal(row) {
    setUserInfo(row);
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleExport = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("管理员列表");
    worksheet.columns = [
      { header: "用户ID", key: "_id", width: 50 },
      { header: "用户账号", key: "loginId", width: 20 },
      { header: "用户密码", key: "loginPwd", width: 50 },
      { header: "用户昵称", key: "nickname", width: 20 },
      { header: "注册时间", key: "registerDate", width: 50 },
      { header: "上次登陆时间", key: "lastLoginDate", width: 50 },
      { header: "当前积分", key: "points", width: 20 },
      { header: "用户头像", key: "avatar", width: 50 },
      { header: "账号状态", key: "enabled", width: 20 },
      { header: "用户邮箱", key: "mail", width: 50 },
      { header: "用户微信", key: "wechat", width: 20 },
      { header: "用户QQ", key: "qq", width: 50 },
      { header: "用户个人介绍", key: "intro", width: 20 }
    ];

    const userData = allUserData.map((item) => {
      return {
        _id: item._id,
        loginId: item.loginId,
        loginPwd: item.loginPwd,
        nickname: item.nickname,
        avatar: `${window.location.origin}${item.avatar}`,
        enabled: item.enabled ? "可用" : "不可用",
        registerDate: formatDate(item.registerDate),
        lastLoginDate: formatDate(item.lastLoginDate),
        points: item.points,
        mail: item.mail,
        wechat: item.wechat,
        qq: item.qq,
        intro: item.intro
      };
    });

    worksheet.addRows(userData);

    const arraybuffer = new ArrayBuffer(10 * 1024 * 1024);
    const res = await workbook.xlsx.writeBuffer(arraybuffer);

    download("用户列表.xlsx", res);
  };

  const inputFileChange = async (e) => {
    const file = e.target.files[0];
    const workbook = new Workbook();
    const worksheet = await workbook.xlsx.load(file);
    let value = null;
    worksheet.eachSheet((sheet, index) => {
      value = sheet.getSheetValues();
    });
    const objArr = [];
    const map = new Map();
    value = value.slice(1);

    for (let i = 0, len = value.length; i < len; i++) {
      const item = value[i];
      const curItem = item.slice(2);

      if (i === 0) {
        for (let j = 0, len = curItem.length; j < len; j++) {
          const val = curItem[j] ?? undefined;
          switch (val) {
            case "用户账号（必填，用户账号不可重复）":
              map.set(j, ["loginId", undefined]);
              break;
            case "用户密码（可选，默认密码为123456）":
              map.set(j, ["loginPwd", "123456"]);
              break;
            case "用户昵称（可选，默认为新用户）":
              map.set(j, ["nickname", "新用户"]);
              break;
            case "用户头像地址（可选，完整URL，默认为系统生成的随机头像）":
              map.set(j, ["avatar", ""]);
              break;
            case "用户邮箱（可选，默认为空）":
              map.set(j, ["mail", ""]);
              break;
            case "QQ号码（可选，默认为空）":
              map.set(j, ["qq", ""]);
              break;
            case "微信号（可选，默认为空）":
              map.set(j, ["wechat", ""]);
              break;
            case "自我介绍（可选，默认为空）":
              map.set(j, ["intro", ""]);
              break;
            case "是否可用（可选，可用true，不可用false，默认true）":
              map.set(j, ["enabled", true]);
              break;
            default:
              break;
          }
        }
      } else {
        const obj = {};
        for (let j = 0, len = curItem.length; j < len; j++) {
          const val = curItem[j] ?? undefined;
          const curVal = map.get(j);
          if (val === false || val) {
            obj[curVal[0]] = val;
          } else {
            obj[curVal[0]] = curVal[1];
          }
        }
        objArr.push(obj);
      }
    }

    for (const oneInfo of objArr) {
      if (oneInfo?.loginId) {
        UserController.addUser(oneInfo).then(
          () => {
            message.success(`新增用户 ${oneInfo.loginId} 成功`);
            actionRef.current.reload();
          },
          () => {
            message.error(`新增用户 ${oneInfo.loginId} 失败`);
          }
        );
      }
    }
  };

  return (
    <>
      <PageContainer>
        <ProTable
          toolbar={{
            actions: [
              <div key={id} className={styles["tools-style"]}>
                <span
                  className={styles["tools-span"]}
                  onClick={() => {
                    UserController.getExcelFile();
                  }}
                >
                  <Tooltip title='下载模版'>
                    <FileExcelOutlined
                      style={{
                        fontSize: "16px"
                      }}
                    />
                  </Tooltip>
                </span>
                <span
                  className={styles["tools-span"]}
                  onClick={() => {
                    inputRef.current.click();
                  }}
                >
                  <Tooltip title='导入（建议下载模版然后导入）'>
                    <ImportOutlined
                      style={{
                        fontSize: "16px"
                      }}
                    />
                  </Tooltip>
                </span>
                <span
                  className={styles["tools-span"]}
                  onClick={() => {
                    handleExport();
                  }}
                >
                  <Tooltip title='导出'>
                    <ExportOutlined
                      style={{
                        fontSize: "16px"
                      }}
                    />
                  </Tooltip>
                </span>
              </div>
            ]
          }}
          headerTitle='用户列表'
          actionRef={actionRef}
          columns={columns}
          rowKey={(row) => row._id}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50, 100],
            ...pagination,
            onChange: handlePageChange
          }}
          request={async (params) => {
            const result = await UserController.getUserByPage(params);
            setAllUserData(result.data.allData);
            return {
              data: result.data.data,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !result.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: result.data.count
            };
          }}
        />
      </PageContainer>
      <input
        ref={inputRef}
        type='file'
        style={{
          display: "none"
        }}
        onChange={inputFileChange}
        accept={".xlsx,.xls"}
      />
      {/* 用户详情信息 */}
      <Modal
        title={userInfo?.nickname}
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ top: 20 }}
        footer={false}
      >
        <h3>登录账号</h3>
        <p>
          <Tag color='red'>{userInfo?.loginId}</Tag>
        </p>
        <h3>登录密码</h3>
        <p>
          <Tag color='magenta'>{userInfo?.loginPwd}</Tag>
        </p>
        <h3>当前头像</h3>
        <Image src={userInfo?.avatar} width={60} />

        <h3>联系方式</h3>
        <div
          style={{
            display: "flex",
            width: "350px",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h4>QQ</h4>
            <p>{userInfo?.qq ? userInfo.qq : "未填写"}</p>
          </div>
          <div>
            <h4>微信</h4>
            <p>{userInfo?.wechat ? userInfo.weichat : "未填写"}</p>
          </div>
          <div>
            <h4>邮箱</h4>
            <p>{userInfo?.mail ? userInfo.mail : "未填写"}</p>
          </div>
        </div>
        <h3>个人简介</h3>
        <p>{userInfo?.intro ? userInfo.intro : "未填写"}</p>
        <h3>时间信息</h3>
        <div
          style={{
            display: "flex",
            width: "450px",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h4>注册时间</h4>
            <p>{formatDate(userInfo?.registerDate)}</p>
          </div>
          <div>
            <h4>上次登录</h4>
            <p>{formatDate(userInfo?.lastLoginDate)}</p>
          </div>
        </div>
        <h3>当前积分</h3>
        <p>{userInfo?.points} 分</p>
      </Modal>
    </>
  );
}

export default User;
