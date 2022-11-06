import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getArticleTitleAsync } from "../redux/articleSlice";
import { getTypeList } from "../redux/typeSlice";
import PageHeader from "../components/PageHeader";
import { Tree, BackTop } from "antd";
import { getArticleById } from "../api/article"

import styles from "../css/Article.module.css"

function Articles(props) {
    const { articleTitleList } = useSelector(state => state.article);
    const { typeList } = useSelector(state => state.type);
    const dispatch = useDispatch();
    const [treeData, setTreeData] = useState([]);
    // 该状态用于存储 id 对应的面试题内容
    const [articleInfo, setArticleInfo] = useState(null);

    useEffect(() => {
        // 每个分类下面的面试题标题
        if (!articleTitleList.length) {
            // 初始化仓库里面的面试题标题
            dispatch(getArticleTitleAsync());
        }
        // 分类名
        if (!typeList.length) {
            dispatch(getTypeList());
        }
        // 上面两个面试题准备好之后，就可以开始组装 tree 组件所需的 data 数组了
        if (typeList.length && articleTitleList.length) {
            const arr = []; // 最终组装的数据会放入到该数组中
            // 添加分类标题
            for (let i = 0; i < typeList.length; i++) {
                arr.push({
                    title: (<h3 style={{ fontWeight: '200' }}>
                        {typeList[i].typeName}
                    </h3>),
                    key: i
                })
            }
            // 每一个分类下面的面试题标题
            for (let i = 0; i < articleTitleList.length; i++) {
                const childArr = [];
                for (let j = 0; j < articleTitleList[i].length; j++) {
                    childArr.push({
                        title: (<h4 style={{ fontWeight: '200' }} onClick={() => clickHandle(articleTitleList[i][j]._id)}>
                            {articleTitleList[i][j].articleTitle}
                        </h4>),
                        key: `${i}-${j}`
                    })
                }
                arr[i].children = childArr;
            }
            setTreeData(arr);
        }
    }, [typeList, articleTitleList])

    async function clickHandle(id) {
        const { data } = await getArticleById(id);
        setArticleInfo(data);
    }


    let articleRightSide = null;
    if (articleInfo) {
        // 赋值为面试题的内容
        articleRightSide = (
            <div className={styles.content}>
                <h1 className={styles.articleRightTitle}>{articleInfo?.articleTitle}</h1>
                <div className={styles.contentContainer}>
                    <div dangerouslySetInnerHTML={{ __html: articleInfo?.articleContent }}></div>
                </div>
            </div>
        );
    } else {
        articleRightSide = (
            <div style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "100",
                marginTop: "150px"
            }}>
                请在左侧选择文章
            </div>
        )
    }


    return (
        <div className={styles.container}>
            <PageHeader title="文章大全" />
            <div className={styles.articleContainer}>
                <div className={styles.leftSide}>
                    <Tree
                        treeData={treeData}
                    />
                </div>
                <div className={styles.rightSide}>
                    {articleRightSide}
                </div>
            </div>
            <BackTop />
        </div>
    );
}

export default Articles;