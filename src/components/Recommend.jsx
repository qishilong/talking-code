import { useEffect, useState } from "react";
import { Card, Carousel } from "antd";
import RecommendItem from "./RecommendItem";
import styles from "../css/Recommend.module.css";
import { getRecommendCarousel } from "../api/recommendCarousel";
import { getRecommendDetail } from "../api/recommendDetail";

/**
 * 右侧的推荐组件
 */
function Recommend(props) {
  const [recommendCarouselData, setRecommendCarouselData] = useState([]);
  const [recommendDetailData, setRecommendDetailData] = useState([]);
  useEffect(() => {
    const carouselFn = async () => {
      const { data } = await getRecommendCarousel();
      setRecommendCarouselData(data);
    };
    carouselFn();
    const detailFn = async () => {
      const { data } = await getRecommendDetail();
      setRecommendDetailData(data);
    };
    detailFn();
  }, []);

  return (
    <Card title='推荐内容'>
      {/* 上方轮播图 */}
      <div style={{ marginBottom: 20 }}>
        <Carousel autoplay>
          {recommendCarouselData?.map((item, index) => {
            return (
              <div key={item._id}>
                <a
                  style={{
                    background: `url(${item.imageUrl}) center/cover no-repeat`
                  }}
                  className={styles.contentStyle}
                  href={item.href ?? "#"}
                  target='_blank'
                  rel='noreferrer'
                ></a>
              </div>
            );
          })}
        </Carousel>
      </div>
      {recommendDetailData?.map((item, index) => {
        return (
          <RecommendItem
            recommendInfo={{
              num: index + 1,
              title: item.title,
              href: item.href
            }}
            key={item._id}
          />
        );
      })}
    </Card>
  );
}

export default Recommend;
