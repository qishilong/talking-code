import { getRecommendCarousel } from "@/services/recommendCarousel";
import { PageContainer } from "@ant-design/pro-components";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import DesItem from "./components/DesItem";
import styles from "./edit.module.less";

interface RecommendCarouselProps {
  imageUrl: string;
  href: string;
  curIndex: number;
  _id?: string;
}

const EditRecommend: FC = () => {
  const [recommendCarouselData, setRecommendCarouselData] = useState<RecommendCarouselProps[]>();
  const [renderList, setRenderList] = useState<boolean>(false);

  const fn = useCallback(async () => {
    const res = await getRecommendCarousel();
    if (res.code === 0) {
      setRecommendCarouselData(res.data);
    }
  }, []);

  useEffect(() => {
    fn();
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
            {recommendCarouselData?.map((item, index) => {
              return (
                <DesItem
                  imageUrl={item.imageUrl}
                  href={item.href}
                  key={item._id}
                  index={index}
                  setRenderList={setRenderList}
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
        </div>
      </div>
    </PageContainer>
  );
};

export default EditRecommend;
