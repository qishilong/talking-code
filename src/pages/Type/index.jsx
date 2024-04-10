import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Form, Input, Popconfirm, Tooltip, message } from "antd";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "umi";
import styles from "./index.module.less";

// 请求方法
import TypeController from "@/services/type";

function Type() {
  const { typeList } = useSelector((state) => state.type);
  const dispatch = useDispatch(); // 获取 dispatch
  const [newTypeInfo, setNewTypeInfo] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });

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

  const ref = useRef();

  const columns = [
    {
      title: "分类名称",
      dataIndex: "typeName",
      key: "typeName",
      align: "center",
      width: "20%",
      render: (val) => {
        if (!val) {
          return "-";
        }
        return (
          <Tooltip
            className={styles["tooltip-styles"]}
            title={<div className={styles["tooltip-styles"]}>{val}</div>}
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{val}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "关联提问",
      dataIndex: "numberOfIssues",
      key: "numberOfIssues",
      align: "center",
      width: "20%"
    },
    {
      title: "关联书籍",
      dataIndex: "numberOfBooks",
      key: "numberOfBooks",
      align: "center",
      width: "20%"
    },
    {
      title: "关联文章",
      dataIndex: "numberOfArticles",
      key: "numberOfArticles",
      align: "center",
      width: "20%"
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      fixed: "right",
      align: "center",
      width: "20%",
      tooltip: "当前有关联内容的分类不可删",
      render: (_, row, index, action) => {
        return [
          <div key={row._id} className={styles["handle-style"]}>
            <Popconfirm
              title='你确定要删除？'
              onConfirm={() => deleteHandle(row)}
              okText='删除'
              cancelText='取消'
            >
              <Button
                type='link'
                size='small'
                disabled={row.numberOfArticles || row.numberOfBooks || row.numberOfIssues}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        ];
      }
    }
  ];

  /**
   * 添加分类
   */
  function addHandle() {
    // 这里需要做一个判断，判断该类型是否已存在
    if (typeList.find((item) => item?.typeName === newTypeInfo)) {
      message.warning("该类型已存在，请不要重复添加");
    } else {
      dispatch({
        type: "type/_addType",
        payload: {
          typeName: newTypeInfo,
          createTime: new Date().getTime().toString()
        }
      });
      // 重置到默认值，包括表单
      ref.current.reset();
      message.success("新增类型成功");
    }
    setNewTypeInfo("");
  }

  /**
   * 删除分类
   * @param {*} adminInfo 一条管理员信息
   */
  function deleteHandle(typeInfo) {
    dispatch({
      type: "type/_deleteType",
      payload: typeInfo
    });
    // 刷新
    ref.current.reload();
    message.success("删除类型成功");
  }

  return (
    <PageContainer>
      <>
        {/* 新增分类 */}
        <div style={{ width: 500, margin: 10, marginBottom: 30 }}>
          <Form layout='inline'>
            <Form.Item>
              <Input
                placeholder='填写新增类型'
                value={newTypeInfo}
                onChange={(e) => setNewTypeInfo(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' shape='round' onClick={addHandle} disabled={!newTypeInfo}>
                新增
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* 分类列表 */}
        <ProTable
          headerTitle='分类信息'
          columns={columns}
          rowKey={(row) => row._id}
          actionRef={ref}
          search={false}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            ...pagination,
            onChange: handlePageChange
          }}
          request={async (params) => {
            const result = await TypeController.getType(params);

            console.log(result, 11);

            dispatch({
              type: "type/_resetTypeList",
              payload: [...result.data.allData]
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
      </>
    </PageContainer>
  );
}

export default Type;
