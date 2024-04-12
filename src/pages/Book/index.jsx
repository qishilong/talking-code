import { download, formatDate, typeOptionCreator } from "@/utils/tool";
import { ExportOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, Select, Tag, Tooltip, message } from "antd";
import { Workbook } from "exceljs";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "umi";

// 请求方法
import BookController from "@/services/book";

import styles from "./index.module.less";

function Book() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const { typeList } = useSelector((state) => state.type);
  const dispatch = useDispatch(); // 获取 dispatch
  const actionRef = useRef();
  const navigate = useNavigate();
  const id = useId();
  const [allBookData, setAllBookData] = useState([]);

  // 按类型进行搜索
  const [searchType, setSearchType] = useState({
    typeId: null
  });

  // 如果类型列表为空，则初始化一次
  if (!typeList.length) {
    dispatch({
      type: "type/_initTypeList"
    });
  }

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
      title: "书籍名称",
      dataIndex: "bookTitle",
      width: "15%",
      key: "bookTitle",
      render: (_, row) => {
        let text = "-";
        if (row?.bookTitle) {
          text = row.bookTitle;
        }
        return (
          <Tooltip
            title={
              row?.bookTitle.length > 0 ? (
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
      title: "书籍简介",
      dataIndex: "bookIntro",
      key: "age",
      width: "30%",
      search: false,
      render: (_, row) => {
        // 将书籍简介的文字进行简化
        let text = "-";
        if (row?.bookIntro) {
          text = row.bookIntro;
        }
        return (
          <Tooltip
            title={
              row?.bookIntro ? (
                <div
                  className={styles["tooltip-styles"]}
                  dangerouslySetInnerHTML={{ __html: text }}
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
            <div className={styles["table-text"]} dangerouslySetInnerHTML={{ __html: text }}></div>
          </Tooltip>
        );
      }
    },
    {
      title: "书籍封面",
      dataIndex: "bookPic",
      key: "bookPic",
      valueType: "image",
      align: "center",
      width: "10%",
      search: false
    },
    {
      title: "浏览数",
      dataIndex: "scanNumber",
      key: "scanNumber",
      align: "center",
      search: false,
      width: "5%"
    },
    {
      title: "评论数",
      dataIndex: "commentNumber",
      key: "commentNumber",
      align: "center",
      search: false,
      width: "5%"
    },
    {
      title: "书籍分类",
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
        const type = typeList.find((item) => item._id === row.typeId);
        return [
          <Tag color='purple' key={row.typeId}>
            {type?.typeName}
          </Tag>
        ];
      }
    },
    {
      title: "上架日期",
      dataIndex: "onShelfDate",
      key: "onShelfDate",
      align: "center",
      search: false,
      width: "15%",
      render: (_, row) => {
        return [formatDate(row.onShelfDate)];
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
            <Button type='link' size='small' onClick={() => navigate(`/book/editBook/${row._id}`)}>
              编辑
            </Button>
            <Popconfirm
              title='是否要删除该书籍以及该书籍对应的评论？'
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

  async function deleteHandle(bookInfo) {
    await BookController.deleteBook(bookInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success("删除书籍成功");
  }

  const handleExport = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("书籍列表");
    worksheet.columns = [
      { header: "书籍ID", key: "_id", width: 50 },
      { header: "书籍名称", key: "bookTitle", width: 50 },
      { header: "书籍简介", key: "bookIntro", width: 50 },
      { header: "书籍封面", key: "bookPic", width: 50 },
      { header: "书籍下载链接", key: "downloadLink", width: 50 },
      { header: "下载所需积分", key: "requirePoints", width: 20 },
      { header: "书籍浏览数", key: "scanNumber", width: 20 },
      { header: "书籍评论数", key: "commentNumber", width: 20 },
      { header: "书籍所属类型", key: "type", width: 50 },
      { header: "书籍上架时间", key: "onShelfDate", width: 50 }
    ];

    const bookData = allBookData.map((item) => {
      if (item.bookIntro) {
        // 在表格中显示书籍简介时，过滤掉 html 标签
        let reg = /<[^<>]+>/g;
        item.bookIntro = item.bookIntro.replace(reg, "");
      }

      if (item.typeId) {
        item.type = typeList.find((val) => val._id === item.typeId)?.typeName;
      }

      return {
        _id: item._id,
        bookTitle: item.bookTitle,
        bookIntro: item.bookIntro,
        bookPic: `${window.location.origin}${item.bookPic}`,
        downloadLink: item.downloadLink,
        requirePoints: item.requirePoints,
        scanNumber: item.scanNumber,
        commentNumber: item.commentNumber,
        type: item.type,
        onShelfDate: formatDate(item.onShelfDate)
      };
    });

    worksheet.addRows(bookData);

    const arraybuffer = new ArrayBuffer(10 * 1024 * 1024);
    const res = await workbook.xlsx.writeBuffer(arraybuffer);

    download("书籍列表.xlsx", res);
  };

  return (
    <>
      {/* 书籍列表 */}
      <PageContainer>
        <ProTable
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
          headerTitle='书籍列表'
          actionRef={actionRef}
          columns={columns}
          rowKey={(row) => row._id}
          params={searchType}
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
            const result = await BookController.getBookByPage(params);
            setAllBookData(result.data.allData);
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
    </>
  );
}

export default Book;
