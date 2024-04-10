import { formatDate, typeOptionCreator } from "@/utils/tool";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Modal, Popconfirm, Radio, Select, Tag, Tooltip, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "umi";

// 请求方法
import BookController from "@/services/book";
import CommentController from "@/services/comment";
import IssueController from "@/services/issue";
import UserController from "@/services/user";

import styles from "./index.module.less";

function Comment() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });

  const dispatch = useDispatch(); // 获取 dispatch
  const actionRef = useRef();

  // 评论类型
  const [commentType, setCommentType] = useState(1);
  const { typeList } = useSelector((state) => state.type);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 按类型进行搜索
  const [searchType, setSearchType] = useState({
    typeId: null
  });

  // 存储评论对应所有的用户
  const [userArr, setUserArr] = useState([]);

  // 存储评论对应的问答或者书籍标题
  const [titleArr, setTitleArr] = useState([]);

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");

  useEffect(() => {
    // 如果类型列表为空，则初始化一次
    if (!typeList.length) {
      dispatch({
        type: "type/_initTypeList"
      });
    }
  }, []);

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
      title: commentType === 1 ? "问题标题" : "书籍标题",
      dataIndex: "commentTitle",
      search: false,
      width: "20%",
      render: (_, row) => {
        const id = row.issueId ? row.issueId : row.bookId;
        const title = titleArr.find((item) => item?._id === id);

        let text = "-";
        if (title?.issueTitle || title?.bookTitle) {
          text = commentType === 1 ? title.issueTitle : title.bookTitle;
        }
        return (
          <Tooltip
            title={
              title?.issueTitle || title?.bookTitle ? (
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
            <div>{text}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "评论内容",
      dataIndex: "commentContent",
      key: "commentContent",
      valueType: "options",
      width: "30%",
      render: (_, row) => {
        // 将问答标题进行简化
        let text = "-";

        if (row?.commentContent) {
          text = row.commentContent;
        }

        return (
          <Tooltip
            title={
              row?.commentContent.length > 0 ? (
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
      title: "评论时间",
      dataIndex: "commentDate",
      key: "commentDate",
      align: "center",
      width: "15%",
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
      title: "点赞数",
      dataIndex: "commentLike",
      key: "commentLike",
      align: "center",
      width: "10%",
      search: false,
      render: (_, row) => {
        return row?.commentLike.length;
      }
    },
    {
      title: "点踩数",
      dataIndex: "commentDislike",
      key: "_id",
      align: "center",
      width: "10%",
      search: false,
      render: (_, row) => {
        return row?.commentDislike.length;
      }
    },
    {
      title: "评论用户",
      align: "center",
      dataIndex: "nickname",
      search: false,
      width: "10%",
      render: (_, row) => {
        const user = userArr.find((item) => item?._id === row?.userId);
        return [
          <Tag color='blue' key={row.userId}>
            {user?.nickname}
          </Tag>
        ];
      }
    },
    {
      title: "评论分类",
      dataIndex: "typeId",
      key: "typeId",
      align: "center",
      width: "10%",
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
          <Tag color='purple' key={row.typeId}>
            {type?.typeName}
          </Tag>
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
          <div key={row?._id} className={styles["handle-style"]}>
            <Button type='link' size='small' onClick={() => showModal(row)}>
              详情
            </Button>
            <Popconfirm
              title='是否要删除该条评论？'
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

  /**
   * 打开修改对话框
   */
  function showModal(row) {
    const id = row.issueId ? row.issueId : row.bookId;
    const title = titleArr.find((item) => item?._id === id);
    setCurrentTitle(commentType === 1 ? title.issueTitle : title.bookTitle);
    setCurrentContent(row.commentContent);
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * 删除该条问答
   * @param {*} bookInfo
   */
  async function deleteHandle(commentInfo) {
    await CommentController.deleteComment(commentInfo?._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success("删除评论成功");
  }

  function handleChange(value) {
    setSearchType({
      typeId: value
    });
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

  const onChange = (e) => {
    setCommentType(e.target.value);
    actionRef.current.reload(); // 再次刷新请求
  };

  return (
    <>
      {/* 评论列表 */}
      <PageContainer>
        <Radio.Group
          onChange={onChange}
          value={commentType}
          style={{
            marginTop: 30,
            marginBottom: 30
          }}
        >
          <Radio.Button value={1} defaultChecked>
            问答评论
          </Radio.Button>
          <Radio.Button value={2}>书籍评论</Radio.Button>
        </Radio.Group>
        <ProTable
          headerTitle='评论列表'
          actionRef={actionRef}
          columns={columns}
          params={searchType}
          rowKey={(row) => row?._id}
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
            const result = await CommentController.getCommentByType(params, commentType);
            const tableData = result.data.data;

            // 获取评论所对应的用户
            // 获取评论所对应的问答或者书籍标题
            const userArr = [];
            const titleArr = [];
            for (let i = 0; i < tableData.length; i++) {
              const { data } = await UserController.getUserById(tableData[i].userId);
              userArr.push(data);
              const id = tableData[i].issueId ? tableData[i].issueId : tableData[i].bookId;
              if (commentType === 1) {
                const { data } = await IssueController.getIssueById(id);
                titleArr.push(data);
              } else {
                const { data } = await BookController.getBookById(id);
                titleArr.push(data);
              }
            }
            setUserArr(userArr);
            setTitleArr(titleArr);

            return {
              data: tableData,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !result.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: result.data.count
            };
          }}
        />
      </PageContainer>
      {/* 评论详情模态框 */}
      <Modal
        title='评论详情'
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ top: 50 }}
        width='50%'
        footer={false}
      >
        <h3>{"标题"}</h3>
        <p>{currentTitle}</p>
        <h3>{"内容"}</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px"
          }}
          dangerouslySetInnerHTML={{ __html: currentContent }}
        ></div>
      </Modal>
    </>
  );
}

export default Comment;
