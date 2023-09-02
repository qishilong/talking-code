import { PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from './components/articleForm';

// 请求方法
import ArticleController from '@/services/article';

function AddArticle() {
	const navigate = useNavigate();

	const [newArticleInfo, setNewArticleInfo] = useState({
		articleTitle: '',
		articleContent: '',
		onShelfDate: '',
		typeId: '',
	});
	/**
	 * 新增文章
	 */
	async function submitHandle(articleContent) {
		// 因为没有使用状态机，所以直接调用控制器方法，进行新增
		await ArticleController.addArticle({
			articleTitle: newArticleInfo.articleTitle,
			articleContent,
			onShelfDate: newArticleInfo.onShelfDate,
			typeId: newArticleInfo.typeId,
		});
		// 跳转回首页
		navigate('/article/articleList');
		message.success('新增文章成功');
	}

	return (
		<PageContainer>
			<div className='container' style={{ width: 1000 }}>
				<ArticleForm
					type='add'
					submitHandle={submitHandle}
					articleInfo={newArticleInfo}
					setArticleInfo={setNewArticleInfo}
				/>
			</div>
		</PageContainer>
	);
}

export default AddArticle;
