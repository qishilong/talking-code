import { PageContainer } from "@ant-design/pro-components";
import { Card, Tag } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "umi";

// 请求方法
import ArticleController from "@/services/article";

function ArticleDetail() {
  const { id } = useParams(); // 获取可能传递过来的 id
  const [articleInfo, setArticleInfo] = useState(null);
  const [typeName, setTypeName] = useState(null);
  const dispatch = useDispatch(); // 获取 dispatch

  // 从仓库获取类型列表
  const { typeList } = useSelector((state) => state.type);

  // 如果类型列表为空，则初始化一次
  if (!typeList.length) {
    dispatch({
      type: "type/_initTypeList"
    });
  }

  // 根据传递过来的 id 获取文章详情
  useEffect(() => {
    async function fetchData() {
      // 根据问答 id 获取该问答具体的信息
      const { data } = await ArticleController.getArticleById(id);
      setArticleInfo(data);
      // 获取 typeId 对应的 typeName
      const type = typeList.find((item) => item._id === data.typeId);
      setTypeName(type?.typeName);
    }
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Card
        title={articleInfo?.articleTitle}
        style={{
          marginBottom: 10
        }}
        extra={
          <Tag color='purple' key={articleInfo?.typeId}>
            {typeName}
          </Tag>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: articleInfo?.articleContent }}></div>
      </Card>
    </PageContainer>
  );
}

export default ArticleDetail;
