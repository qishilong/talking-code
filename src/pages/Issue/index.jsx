import { download, formatDate, typeOptionCreator } from "@/utils/tool";
import { ExportOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, Select, Switch, Tag, Tooltip, message } from "antd";
import { Workbook } from "exceljs";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "umi";

// 请求方法
import IssueController from "@/services/issue";

import styles from "./index.module.less";

function Issue() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const [checkStatus, setCheckStatus] = useState(null);

  const dispatch = useDispatch(); // 获取 dispatch
  const navigate = useNavigate();
  const actionRef = useRef();
  const id = useId();
  const { typeList } = useSelector((state) => state.type);
  const [allIssueData, setAllIssueData] = useState([]);

  // 按类型进行搜索
  const [searchType, setSearchType] = useState({
    typeId: null
  });

  useEffect(() => {
    // 如果类型列表为空，则初始化一次
    if (!typeList.length) {
      dispatch({
        type: "type/_initTypeList"
      });
    }
  }, []);

  // 表格列
  const columns = [
    {
      title: "序号",
      align: "center",
      width: "5%",
      render: (text, record, index) => {
        return [(pagination.current - 1) * pagination.pageSize + index + 1];
      },
      search: false
    },
    {
      title: "问题标题",
      dataIndex: "issueTitle",
      key: "issueTitle",
      width: "15%",
      render: (_, row) => {
        let text = "-";
        if (row?.issueTitle) {
          text = row.issueTitle;
        }
        return (
          <Tooltip
            title={
              row?.issueTitle ? (
                <div
                  dangerouslySetInnerHTML={{ __html: text }}
                  className={styles["tooltip-styles"]}
                ></div>
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
      title: "问题描述",
      dataIndex: "issueContent",
      key: "issueContent",
      search: false,
      width: "30%",
      render: (_, row) => {
        // 将问答描述的文字进行简化

        let text = "-";

        if (row?.issueContent) {
          text = row.issueContent;
        }

        return (
          <Tooltip
            title={
              row?.issueContent.length > 0 ? (
                <div
                  dangerouslySetInnerHTML={{ __html: text }}
                  className={styles["tooltip-styles"]}
                ></div>
              ) : undefined
            }
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: text }} className={styles["table-text"]}></div>
          </Tooltip>
        );
      }
    },
    {
      title: "浏览数",
      dataIndex: "scanNumber",
      key: "scanNumber",
      align: "center",
      width: "5%",
      search: false
    },
    {
      title: "评论数",
      dataIndex: "commentNumber",
      key: "commentNumber",
      align: "center",
      width: "5%",
      search: false
    },
    {
      title: "点赞数",
      dataIndex: "issueLike",
      key: "issueLike",
      align: "center",
      width: "5%",
      search: false,
      render: (_, row) => {
        return row?.issueLike.length;
      }
    },
    {
      title: "点踩数",
      dataIndex: "issueDislike",
      key: "_id",
      align: "center",
      width: "5%",
      search: false,
      render: (_, row) => {
        return row?.issueDislike.length;
      }
    },
    {
      title: "用户账号",
      dataIndex: ["userId", "loginId"],
      key: ["userId", "loginId"],
      width: "10%",
      align: "center",
      search: false,
      render: (val, row) => {
        return [
          <Tag color='red' key={row?.typeId}>
            {val}
          </Tag>
        ];
      }
    },
    {
      title: "用户昵称",
      dataIndex: ["userId", "nickname"],
      key: ["userId", "nickname"],
      width: "10%",
      align: "center",
      search: false,
      render: (val, row) => {
        return [
          <Tag color='blue' key={row?.typeId}>
            {val}
          </Tag>
        ];
      }
    },
    {
      title: "问题分类",
      dataIndex: "typeId",
      key: "typeId",
      width: "10%",
      align: "center",
      renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        return (
          <Select placeholder='请选择查询分类' onChange={handleChange} allowClear>
            {typeOptionCreator(Select, typeList)}
          </Select>
        );
      },
      render: (_, row) => {
        // 寻找对应类型的类型名称
        const type = typeList.find((item) => item?._id === row?.typeId);
        return [
          <Tag color='purple' key={row?.typeId}>
            {type?.typeName}
          </Tag>
        ];
      }
    },
    {
      title: "提问时间",
      dataIndex: "issueDate",
      key: "issueDate",
      align: "center",
      width: "10%",
      search: false,
      render: (val, row) => {
        return (
          <Tooltip
            title={
              val ? <div className={styles["tooltip-styles"]}>{formatDate(val)}</div> : undefined
            }
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text-date"]}>{val ? formatDate(val) : "-"}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "审核状态",
      dataIndex: "issueStatus",
      key: "issueStatus",
      align: "center",
      width: "10%",
      renderFormItem: () => {
        return (
          <Select
            onChange={(val) => {
              setCheckStatus(val);
            }}
            placeholder='请选择查询分类'
            allowClear
            options={[
              {
                label: "true",
                value: "true"
              },
              {
                label: "false",
                value: "false"
              }
            ]}
          ></Select>
        );
      },
      render: (_, row, index, action) => {
        const defaultChecked = row?.issueStatus ? true : false;
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
            <Button type='link' size='small' onClick={() => navigate(`/issue/${row?._id}`)}>
              详情
            </Button>
            <Popconfirm
              title='是否要删除该问答以及该问答对应的评论？'
              onConfirm={() => deleteHandle(row)}
              okText='删除'
              cancelText='取消'
            >
              <Button type='link' size='small'>
                删除
              </Button>
            </Popconfirm>
          </div>
        ];
      }
    }
  ];

  function handleChange(value) {
    setSearchType({
      typeId: value
    });
  }

  /**
   * 删除该条问答
   * @param {*} bookInfo
   */
  async function deleteHandle(issueInfo) {
    await IssueController.deleteIssue(issueInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success("删除问答成功");
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
   * 修改管理员的可用状态
   * @param {*} row 当前这一条管理员信息
   * @param {*} value 新的可用状态
   */
  async function switchChange(row, value) {
    // 不同于管理员，这里直接通过控制器来发请求

    const res = await IssueController.editIssue(row._id, {
      issueStatus: value
    });
    if (res.code === 0) {
      if (value) {
        message.success("该问题审核已通过");
      } else {
        message.info("该问题待审核");
      }
    } else {
      message.error("问题更改状态失败");
    }
  }

  const handleExport = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("问题列表");
    worksheet.columns = [
      { header: "问题ID", key: "_id", width: 50 },
      { header: "问题标题", key: "issueTitle", width: 50 },
      { header: "问题描述", key: "issueContent", width: 50 },
      { header: "问题浏览数", key: "scanNumber", width: 20 },
      { header: "问题评论数", key: "commentNumber", width: 20 },
      { header: "问题点赞数", key: "issueLikeNumber", width: 20 },
      { header: "问题点踩数", key: "issueDislikeNumber", width: 20 },
      { header: "问题点赞人员", key: "issueLike", width: 50 },
      { header: "问题点踩人员", key: "issueDislike", width: 50 },
      { header: "问题提问用户账号", key: "loginId", width: 50 },
      { header: "问题提问用户昵称", key: "nickname", width: 50 },
      { header: "问题类型", key: "type", width: 50 },
      { header: "问题提问时间", key: "issueDate", width: 50 },
      { header: "问题状态", key: "issueStatus", width: 20 }
    ];

    const bookData = allIssueData.map((item) => {
      if (item.issueContent) {
        // 在表格中显示问题简介时，过滤掉 html 标签
        let reg = /<[^<>]+>/g;
        item.issueContent = item.issueContent.replace(reg, "");
      }

      if (item.typeId) {
        item.type = typeList.find((val) => val._id === item.typeId)?.typeName;
      }

      return {
        _id: item._id,
        issueTitle: item.issueTitle,
        issueContent: item.issueContent,
        scanNumber: item.scanNumber,
        commentNumber: item.commentNumber,
        issueLikeNumber: item.issueLike.length,
        issueDislikeNumber: item.issueDislike.length,
        issueLike: item.issueLike,
        issueDislike: item.issueDislike,
        loginId: item.userId.loginId,
        nickname: item.userId.nickname,
        type: item.type,
        issueDate: formatDate(item.issueDate),
        issueStatus: item.issueStatus
      };
    });

    worksheet.addRows(bookData);

    const arraybuffer = new ArrayBuffer(10 * 1024 * 1024);
    const res = await workbook.xlsx.writeBuffer(arraybuffer);

    download("问题列表.xlsx", res);
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle='问题列表'
        actionRef={actionRef}
        columns={columns}
        params={{ typeId: searchType.typeId, issueStatus: checkStatus }}
        rowKey={(row) => row._id}
        scroll={{
          x: "2200px"
        }}
        toolbar={{
          actions: [
            <div key={id} className={styles["tools-style"]}>
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
        onReset={() => {
          setSearchType({
            typeId: null
          });
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50, 100],
          ...pagination,
          onChange: handlePageChange
        }}
        request={async (params) => {
          const result = await IssueController.getIssueByPage(params);
          setAllIssueData(result.data.allData);
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
  );
}

export default Issue;
