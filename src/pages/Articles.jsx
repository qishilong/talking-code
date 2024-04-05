import React from "react";
import { Tree, BackTop } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { getArticleTitleList } from "../redux/articleSlice";
import { getTypeList } from "../redux/typeSlice";
import { useState, useEffect } from "react";
import { getArticleById } from "../api/article";

import PageHeader from "../components/PageHeader";

import styles from "../css/Article.module.css";

function Articles(props) {
  const dispatch = useDispatch();
  const { typeList } = useSelector((state) => state?.type);
  const { articleTitleList } = useSelector((state) => state?.article);
  const [treeData, setTreeData] = useState([]);
  const [articleInfo, setArticleInfo] = useState(null);

  useEffect(() => {
    if (!articleTitleList.length) {
      dispatch(getArticleTitleList());
    }
    if (!typeList.length) {
      dispatch(getTypeList());
    }
    if (typeList.length && articleTitleList.length) {
      // 开始组装 treeData
      const arr = [];
      for (let i = 0; i < typeList.length; i++) {
        arr.push({
          title: (
            <h3
              style={{
                fontWeight: "200"
              }}
            >
              {typeList[i].typeName}
            </h3>
          ),
          key: i
        });
      }
      for (let i = 0; i < articleTitleList.length; i++) {
        const childrenArr = [];
        for (let j = 0; j < articleTitleList[i].length; j++) {
          childrenArr.push({
            title: (
              <h4
                onClick={() => clickHandle(articleTitleList[i][j]._id)}
                style={{
                  fontWeight: "200"
                }}
              >
                {articleTitleList[i][j].articleTitle}
              </h4>
            ),
            key: `${i}-${j}`
          });
        }
        arr[i].children = childrenArr;
      }
      setTreeData(arr);
    }
  }, [typeList, articleTitleList]);

  async function clickHandle(articleId) {
    const { data } = await getArticleById(articleId);
    setArticleInfo(data);
  }

  let articleRightSide = null;
  if (articleInfo) {
    articleRightSide = (
      <div className={styles.content}>
        <h1 className={styles?.articleRightTitle}>{articleInfo?.articleTitle}</h1>
        <div className={styles.contentContainer}>
          <div dangerouslySetInnerHTML={{ __html: articleInfo?.articleContent }}></div>
        </div>
      </div>
    );
  } else {
    articleRightSide = (
      <div
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: "100",
          marginTop: "150px"
        }}
      >
        请在左侧选择文章
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader title='文章大全' />
      <div className={styles.articleContainer}>
        <div className={styles.leftSide}>
          <Tree treeData={treeData} />
        </div>
        <div className={styles.rightSide}>{articleRightSide}</div>
      </div>
      <BackTop />
    </div>
  );
}

export default Articles;
