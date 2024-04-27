import AdminController from "@/services/admin";
import { download } from "@/utils/tool";
import { ExportOutlined, FileExcelOutlined, ImportOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useDispatch, useModel, useSelector } from "@umijs/max";
import { Button, Modal, Popconfirm, Switch, Tag, Tooltip, message } from "antd";
import { Workbook } from "exceljs";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminForm from "./components/adminForm";

// 请求方法

import styles from "./index.module.less";

function Admin(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { initialState } = useModel("@@initialState");

  // 控制修改面包开启的状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 从仓库获取管理员数据
  const { adminList } = useSelector((state) => state.admin);

  // 存储当前要修改的管理员信息
  const [adminInfo, setAdminInfo] = useState(null);
  const [allAdminData, setAllAdminData] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });

  const ref = useRef();
  const inputRef = useRef();
  const id = useId();

  // 对应表格每一列的配置
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
      title: "登录密码",
      dataIndex: "loginPwd",
      key: "loginPwd",
      align: "center",
      search: false
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
      align: "center",
      render: (_, row) => {
        let text = "-";
        if (row?.nickname) {
          text = row.nickname;
        }
        return (
          <Tooltip
            title={
              row?.nickname ? <div className={styles["tooltip-styles"]}>{text}</div> : undefined
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
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      search: false,
      valueType: "avatar"
    },
    {
      title: "权限",
      dataIndex: "permission",
      key: "permission",
      align: "center",
      search: false,
      render: (_, row) => {
        let tag =
          row.permission === 1 ? (
            <Tag color='orange' key={row._id}>
              超级管理员
            </Tag>
          ) : (
            <Tag color='blue' key={row._id}>
              普通管理员
            </Tag>
          );
        return tag;
      }
    },
    {
      title: "账号状态",
      dataIndex: "enabled",
      key: "enabled",
      align: "center",
      search: false,
      render: (_, row) => {
        if (row._id === initialState.adminInfo._id) {
          // 说明是当前登录的账号
          return <Tag color='red'>-</Tag>;
        } else {
          return (
            <Switch
              key={row._id}
              size='small'
              defaultChecked={row.enabled ? true : false}
              onChange={(value) => switchChange(row, value)}
            />
          );
        }
      }
    },
    {
      title: "操作",
      width: 150,
      key: "option",
      align: "center",
      search: false,
      render: (_, row) => {
        return (
          <div key={row._id} className={styles["handle-style"]}>
            <Button type='link' size='small' onClick={() => showModal(row)}>
              编辑
            </Button>
            <Popconfirm
              title='是否确定删除此管理员'
              onConfirm={() => {
                deleteHandle(row);
                // 重置到默认值，包括表单
                ref.current.reset();
              }}
              okText='确定'
              cancelText='取消'
            >
              <Button type='link' size='small' disabled={initialState.name === row.loginId}>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  /**
   * 打开修改面板
   */
  function showModal(row) {
    setIsModalOpen(true);
    setAdminInfo(row);
  }

  /**
   * 点击修改面包确定按钮时的回调
   */
  const handleOk = () => {
    dispatch({
      type: "admin/_editAdmin",
      payload: {
        adminInfo,
        newAdminInfo: adminInfo
      }
    });

    // 刷新
    ref.current.reload();
    message.success("修改管理员信息成功");
    setIsModalOpen(false);
  };

  /**
   * 点击修改面板取消按钮时关闭该面板
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * 删除管理员
   * @param {*} adminInfo
   */
  function deleteHandle(adminInfo) {
    // 需要判断是否是当前登录的账户

    // 派发删除对应的 action
    dispatch({
      type: "admin/_deleteAdmin",
      payload: adminInfo
    });

    ref.current.reset();

    message.success("删除管理员成功");
  }

  /**
   * 修改管理员可用状态
   */
  function switchChange(row, value) {
    // 派发一个 action
    dispatch({
      type: "admin/_editAdmin",
      payload: {
        adminInfo: row,
        newAdminInfo: {
          enabled: value
        }
      }
    });

    value ? message.success("管理员状态已激活") : message.success("管理员已禁用");
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

  const handleExport = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("管理员列表");
    worksheet.columns = [
      { header: "管理员ID", key: "_id", width: 50 },
      { header: "管理员账号", key: "loginId", width: 20 },
      { header: "管理员密码", key: "loginPwd", width: 50 },
      { header: "管理员昵称", key: "nickname", width: 20 },
      { header: "管理员头像", key: "avatar", width: 50 },
      { header: "管理员权限", key: "permission", width: 20 },
      { header: "账号状态", key: "enabled", width: 20 }
    ];

    const adminData = allAdminData.map((item) => {
      return {
        _id: item._id,
        loginId: item.loginId,
        loginPwd: item.loginPwd,
        nickname: item.nickname,
        avatar: `${window.location.origin}${item.avatar}`,
        permission: item.permission === 1 ? "超级管理员" : "普通管理员",
        enabled: item.enabled ? "可用" : "不可用"
      };
    });

    worksheet.addRows(adminData);

    const arraybuffer = new ArrayBuffer(10 * 1024 * 1024);
    const res = await workbook.xlsx.writeBuffer(arraybuffer);

    download("管理员列表.xlsx", res);
  };

  // 读取用户上传的excel文件数据，并且根据excel的数据批量添加用户
  const inputFileChange = async (e) => {
    // 获取上传的excel文件
    const file = e.target.files[0];
    const workbook = new Workbook();
    // 读取excel文件数据
    const worksheet = await workbook.xlsx.load(file);
    let value = null;
    // 取出读取的excel文件数据
    worksheet.eachSheet((sheet, index) => {
      value = sheet.getSheetValues();
    });
    // 存储excel表格中每行的数据
    const objArr = [];
    const map = new Map();
    value = value.slice(1);
    for (let i = 0, len = value.length; i < len; i++) {
      const curItem = value[i].slice(2);

      if (i === 0) {
        for (let j = 0, len = curItem.length; j < len; j++) {
          const val = curItem[j] ?? undefined;

          switch (val) {
            case "管理员账号（必填，管理员账号不可重复）":
              map.set(j, ["loginId", undefined]);
              break;
            case "管理员密码（可选，默认是123123）":
              map.set(j, ["loginPwd", "123123"]);
              break;
            case "管理员昵称（可选，默认是新增管理员）":
              map.set(j, ["nickname", "新增管理员"]);
              break;
            case "管理员权限选择（必填，超级管理员1，普通管理员2）":
              map.set(j, ["permission", 2]);
              break;
            case "管理员头像地址（可选，完整URL，默认为系统生成的随机头像）":
              map.set(j, ["avatar", ""]);
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
          const curVal = map.get(j);
          const val = curItem[j] ?? undefined;

          if (val || typeof val === "boolean") {
            if (curVal[0] !== "permission" && typeof val !== "boolean") {
              obj[curVal[0]] = String(val);
            } else {
              obj[curVal[0]] = val;
            }
          } else {
            if (curVal[0] !== "permission") {
              obj[curVal[0]] = String(curVal[1]);
            } else {
              obj[curVal[0]] = curVal[1];
            }
          }
        }
        objArr.push(obj);
      }
    }

    // 批量添加用户
    for (const oneInfo of objArr) {
      if (oneInfo?.loginId) {
        // 触发添加用户事件
        dispatch({
          type: "admin/_addAdmin",
          payload: oneInfo
        });
        ref.current.reload();
      }
    }
  };

  return (
    <div>
      <PageContainer>
        <ProTable
          toolbar={{
            actions: [
              <div key={id} className={styles["tools-style"]}>
                <span
                  className={styles["tools-span"]}
                  onClick={() => {
                    AdminController.getExcelFile();
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
          headerTitle='管理员列表'
          rowKey={(row) => row._id}
          actionRef={ref}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            ...pagination,
            onChange: handlePageChange
          }}
          request={async (params) => {
            const result = await AdminController.getAdmin(params);
            setAllAdminData(result.data.allData);

            dispatch({
              type: "admin/_initAdminList",
              payload: result.data.data
            });

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
      {/* 修改面板 */}
      <Modal
        title='修改管理员信息'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: "50px" }}
      >
        <AdminForm
          type='edit'
          adminInfo={adminInfo}
          setAdminInfo={setAdminInfo}
          submitHandle={handleOk}
        />
      </Modal>
    </div>
  );
}

export default Admin;
