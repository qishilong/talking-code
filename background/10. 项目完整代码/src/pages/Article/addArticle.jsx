import ArticleForm from './components/articleForm';
import { PageContainer } from '@ant-design/pro-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

// 请求方法
import ArticleController from '@/services/article';

function AddArticle() {
  const navigate = useNavigate();

  const [newArticleInfo, setNewArticleInfo] = useState({
    articleTitle: '',
    articleContent: '',
    typeId: '',
  });

  /**
   * 新增文章
   */
  function submitHandle(articleContent) {
    // 因为没有使用状态机，所以直接调用控制器方法，进行新增
    ArticleController.addArticle({
      articleTitle: newArticleInfo.articleTitle,
      articleContent,
      typeId: newArticleInfo.typeId,
    });
    // 跳转回首页
    navigate('/article/articleList');
    message.success('新增文章成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 1000 }}>
        <ArticleForm
          type="add"
          submitHandle={submitHandle}
          articleInfo={newArticleInfo}
          setArticleInfo={setNewArticleInfo}
        />
      </div>
    </PageContainer>
  );
}

export default AddArticle;
