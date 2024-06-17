import { PageContainer } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleForm from "./components/articleForm";

// 请求方法
import ArticleController from "@/services/article";

function EditArticle() {
  const { id } = useParams(); // 获取可能传递过来的 id
  const [articleInfo, setArticleInfo] = useState(null);
  const navigate = useNavigate();

  // 根据传递过来的 id 获取文章详情
  useEffect(() => {
    async function fetchData() {
      // 根据问答 id 获取该问答具体的信息
      const { data } = await ArticleController.getArticleById(id);
      setArticleInfo(data);
    }
    fetchData();
  }, []);

  /**
   * 修改文章
   */
  async function submitHandle(articleContent) {
    // 因为没有使用状态机，所以直接调用控制器方法，进行新增
    await ArticleController.editArticle(id, {
      articleTitle: articleInfo.articleTitle,
      articleContent,
      onShelfDate: articleInfo.onShelfDate,
      typeId: articleInfo.typeId
    });
    // 跳转回首页
    navigate("/article/articleList");
    message.success("修改文章成功");
  }

  return (
    <PageContainer>
      <div className='container' style={{ width: 1000 }}>
        <ArticleForm
          type='edit'
          submitHandle={submitHandle}
          articleInfo={articleInfo}
          setArticleInfo={setArticleInfo}
        />
      </div>
    </PageContainer>
  );
}

export default EditArticle;
