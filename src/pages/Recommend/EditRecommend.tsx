import { getRecommendCarousel } from "@/services/recommendCarousel";
import { getRecommendDetail } from "@/services/recommendDetail";
import { PageContainer } from "@ant-design/pro-components";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import CarouselItem from "./components/CarouselItem";
import ListItem from "./components/ListItem";
import styles from "./edit.module.less";

interface RecommendCarouselProps {
  imageUrl: string;
  href: string;
  curIndex: number;
  _id?: string;
}

interface RecommendListProps {
  title: string;
  href: string;
  curIndex: number;
  _id?: string;
}

const EditRecommend: FC = () => {
  const [recommendCarouselData, setRecommendCarouselData] = useState<RecommendCarouselProps[]>();
  const [recommendListData, setRecommendListData] = useState<RecommendListProps[]>();
  const [renderCarouselList, setRenderCarouselList] = useState<boolean>(false);
  const [renderList, setRenderList] = useState<boolean>(false);

  const carouselFn = useCallback(async () => {
    const res = await getRecommendCarousel();
    if (res.code === 0) {
      setRecommendCarouselData(res.data);
    }
  }, []);

  const listFn = useCallback(async () => {
    const res = await getRecommendDetail();
    if (res.code === 0) {
      setRecommendListData(res.data);
    }
  }, []);

  useEffect(() => {
    carouselFn();
  }, [renderCarouselList]);

  useEffect(() => {
    listFn();
  }, [renderList]);
  return (
    <PageContainer
      style={{
        height: "100%"
      }}
    >
      <div className={styles["edit-recommend-styles"]}>
        <div className={styles.content}>
          <div className={styles.title}>轮播图</div>
          <div className={styles.container}>
            {recommendCarouselData?.map((item) => {
              return (
                <CarouselItem
                  imageUrl={item.imageUrl}
                  href={item.href}
                  key={item._id}
                  curIndex={item.curIndex}
                  setRenderCarouselList={setRenderCarouselList}
                  canAdd={recommendCarouselData.length < 10}
                  _id={item._id}
                  canDel={recommendCarouselData.length > 1}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>推荐列表</div>
          <div className={styles.container}>
            {recommendListData?.map((item) => {
              return (
                <ListItem
                  key={item._id}
                  curIndex={item.curIndex}
                  title={item.title}
                  href={item.href}
                  setRenderList={setRenderList}
                  canAdd={recommendListData.length < 10}
                  canDel={recommendListData.length > 1}
                  _id={item._id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default EditRecommend;
