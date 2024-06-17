import { download, formatDate, typeOptionCreator } from "@/utils/tool";
import { ExportOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, DatePicker, Popconfirm, Select, Tag, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { Workbook } from "exceljs";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "umi";

// 请求方法
import ArticleController from "@/services/article";

import styles from "./index.module.less";

function Article() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const dispatch = useDispatch(); // 获取 dispatch
  const navigate = useNavigate();
  const { typeList } = useSelector((state) => state.type);
  const actionRef = useRef();
  const id = useId();
  const [allArticleData, setAllArticleData] = useState([]);

  // 按类型进行搜索
  const [searchType, setSearchType] = useState({
    typeId: null,
    onShelfDate: undefined
  });

  // 如果类型列表为空，则初始化一次
  if (!typeList.length) {
    dispatch({
      type: "type/_initTypeList"
    });
  }

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  function handleChange(value) {
    setSearchType({
      ...searchType,
      ...value
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
      title: "文章名称",
      dataIndex: "articleTitle",
      key: "articleTitle",
      width: "20%",
      render: (_, row) => {
        // 将书籍简介的文字进行简化
        let text = "-";
        if (row?.articleTitle) {
          text = row.articleTitle;
        }
        return (
          <Tooltip
            title={
              row?.articleTitle.length > 0 ? (
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
      title: "文章分类",
      dataIndex: "typeId",
      key: "typeId",
      align: "center",
      width: "10%",
      renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        return (
          <Select
            placeholder='请选择查询分类'
            onChange={(e) => handleChange({ typeId: e })}
            allowClear
          >
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
      width: "10%",
      renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        return (
          <DatePicker
            format='YYYY-MM-DD'
            disabledDate={disabledDate}
            onChange={(e) => {
              handleChange({
                onShelfDate: e ? String(e.valueOf()) : undefined
              });
            }}
            value={searchType?.onShelfDate && dayjs(Number(searchType?.onShelfDate))}
          />
        );
        c;
      },
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
            <Button
              type='link'
              size='small'
              onClick={() => navigate(`/article/articleList/${row._id}`)}
            >
              详情
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => navigate(`/article/editArticle/${row._id}`)}
            >
              编辑
            </Button>
            <Popconfirm
              title='是否要删除该文章？'
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

  async function deleteHandle(articleInfo) {
    await ArticleController.deleteArticle(articleInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success("删除文章成功");
  }

  const handleExport = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("文章列表");
    worksheet.columns = [
      { header: "文章ID", key: "_id", width: 50 },
      { header: "文章标题", key: "articleTitle", width: 50 },
      { header: "文章内容", key: "articleContent", width: 50 },
      { header: "书籍所属类型", key: "type", width: 50 },
      { header: "文章上架日期", key: "onShelfDate", width: 50 }
    ];

    const articleData = allArticleData.map((item) => {
      if (item.articleContent) {
        // 在表格中显示文章简介时，过滤掉 html 标签
        let reg = /<[^<>]+>/g;
        item.articleContent = item.articleContent.replace(reg, "");
      }

      if (item.typeId) {
        item.type = typeList.find((val) => val._id === item.typeId)?.typeName;
      }

      return {
        _id: item._id,
        articleTitle: item.articleTitle,
        articleContent: item.articleContent,
        type: item.type,
        onShelfDate: formatDate(item.onShelfDate)
      };
    });

    worksheet.addRows(articleData);

    const arraybuffer = new ArrayBuffer(10 * 1024 * 1024);
    const res = await workbook.xlsx.writeBuffer(arraybuffer);

    download("文章列表.xlsx", res);
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
          headerTitle='文章列表'
          columns={columns}
          params={searchType}
          actionRef={actionRef}
          rowKey={(row) => row._id}
          onReset={() => {
            setSearchType({
              typeId: null,
              onShelfDate: undefined
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
            const result = await ArticleController.getArticleByPage(params);
            setAllArticleData(result.data.allData);
            return {
              data: result?.data?.data,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !result?.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: result?.data?.count
            };
          }}
        />
      </PageContainer>
    </>
  );
}

export default Article;
