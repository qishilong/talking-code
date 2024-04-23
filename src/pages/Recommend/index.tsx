import { deleteRecommendCarousel, getRecommendCarousel } from "@/services/recommendCarousel";
import { deleteRecommendDetail, getRecommendDetail } from "@/services/recommendDetail";
import type { ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, Tooltip, message } from "antd";
import type { FC } from "react";
import { useRef, useState } from "react";
import styles from "./index.module.less";

interface RecommendCarouselProps {
  imageUrl: string;
  href: string;
  _id: string;
}
interface RecommendDetailProps {
  title: string;
  href: string;
  _id: string;
}

const Recommend: FC = () => {
  const [recommendCarouselData, setRecommendCarouselData] = useState<RecommendCarouselProps[]>();
  const [recommendDetailData, setRecommendDetailData] = useState<RecommendDetailProps[]>();
  const carouseRef = useRef<any>();
  const detailRef = useRef<any>();

  const deleteCarouselHandle = async (val: string) => {
    const res = await deleteRecommendCarousel(val);
    if (res.code === 0) {
      message.success("删除成功");
      if (carouseRef.current) {
        carouseRef.current.reload();
      }
    } else {
      message.error("删除失败");
    }
  };

  const deleteDetailHandle = async (val: string) => {
    const res = await deleteRecommendDetail(val);
    if (res.code === 0) {
      message.success("删除成功");
      if (detailRef.current) {
        detailRef.current.reload();
      }
    } else {
      message.error("删除失败");
    }
  };
  const carouseColumns: ProColumns[] = [
    {
      title: "序号",
      align: "center",
      width: "5%",
      search: false,
      render: (text: any, record: any, index: number) => {
        return index;
      }
    },
    {
      title: "图片地址",
      dataIndex: "imageUrl",
      width: "30%",
      key: "imageUrl",
      search: false,
      render: (val) => {
        return (
          <Tooltip
            title={val ? <div className={styles["tooltip-styles"]}>{val}</div> : undefined}
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{val ? val : "-"}</div>
          </Tooltip>
        );
      }
    },

    {
      title: "跳转地址",
      dataIndex: "href",
      key: "href",
      width: "30%",
      search: false,
      render: (val) => {
        return (
          <Tooltip
            title={val ? <div className={styles["tooltip-styles"]}>{val}</div> : undefined}
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{val ? val : "-"}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "书籍封面",
      dataIndex: "imageUrl",
      key: "imageUrl",
      valueType: "image",
      align: "center",
      width: "20%",
      search: false
    },
    {
      title: "操作",
      width: "15%",
      key: "_id",
      dataIndex: "_id",
      valueType: "option",
      fixed: "right",
      align: "center",
      render: (val, row: RecommendCarouselProps) => {
        return (
          <div className={styles["handle-style"]}>
            <Popconfirm
              title='是否要删除该书籍以及该书籍对应的评论？'
              onConfirm={() => deleteCarouselHandle(row._id)}
              okText='删除'
              cancelText='取消'
            >
              <Button type='link' size='small' disabled={recommendCarouselData!.length <= 1}>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const detailColumns: ProColumns[] = [
    {
      title: "序号",
      align: "center",
      width: "5%",
      search: false,
      render: (text: any, record: any, index: number) => {
        return index;
      }
    },
    {
      title: "推荐题目",
      dataIndex: "title",
      width: "30%",
      key: "title",
      search: false,
      render: (val) => {
        return (
          <Tooltip
            title={val ? <div className={styles["tooltip-styles"]}>{val}</div> : undefined}
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{val ? val : "-"}</div>
          </Tooltip>
        );
      }
    },

    {
      title: "题目地址",
      dataIndex: "href",
      key: "href",
      width: "30%",
      search: false,
      render: (val) => {
        return (
          <Tooltip
            title={val ? <div className={styles["tooltip-styles"]}>{val}</div> : undefined}
            placement='top'
            destroyTooltipOnHide={true}
            color='#fff'
            overlayStyle={{
              maxWidth: "500px"
            }}
          >
            <div className={styles["table-text"]}>{val ? val : "-"}</div>
          </Tooltip>
        );
      }
    },
    {
      title: "操作",
      width: "25%",
      key: "_id",
      dataIndex: "_id",
      valueType: "option",
      fixed: "right",
      align: "center",
      render: (val, row: RecommendCarouselProps) => {
        return (
          <div className={styles["handle-style"]}>
            <Popconfirm
              title='是否要删除该书籍以及该书籍对应的评论？'
              onConfirm={() => deleteDetailHandle(row._id)}
              okText='删除'
              cancelText='取消'
            >
              <Button type='link' size='small' disabled={recommendDetailData!.length <= 1}>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  return (
    <PageContainer>
      <ProTable
        style={{
          marginBottom: "24px"
        }}
        search={false}
        headerTitle='图片列表'
        rowKey={(row) => row._id}
        actionRef={carouseRef}
        columns={carouseColumns}
        pagination={undefined}
        scroll={{
          x: "1000"
        }}
        request={async () => {
          const result = await getRecommendCarousel();
          setRecommendCarouselData(result.data);
          return {
            data: result.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: !result.code
          };
        }}
      />
      <ProTable
        search={false}
        headerTitle='内容列表'
        rowKey={(row) => row._id}
        actionRef={detailRef}
        columns={detailColumns}
        pagination={undefined}
        scroll={{
          x: "1000"
        }}
        request={async () => {
          const result = await getRecommendDetail();
          setRecommendDetailData(result.data);
          return {
            data: result.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: !result.code
          };
        }}
      />
    </PageContainer>
  );
};

export default Recommend;
