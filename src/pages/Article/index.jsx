import { formatDate, typeOptionCreator } from '@/utils/tool';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Popconfirm, Select, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'umi';

// 请求方法
import ArticleController from '@/services/article';

function Article() {
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
	});

	const dispatch = useDispatch(); // 获取 dispatch
	const navigate = useNavigate();
	const { typeList } = useSelector((state) => state.type);
	const actionRef = useRef();

	// 按类型进行搜索
	const [searchType, setSearchType] = useState({
		typeId: null,
		onShelfDate: undefined,
	});

	// 如果类型列表为空，则初始化一次
	if (!typeList.length) {
		dispatch({
			type: 'type/_initTypeList',
		});
	}

	const disabledDate = (current) => {
		return current && current > dayjs().endOf('day');
	};

	function handleChange(value) {
		setSearchType({
			...searchType,
			...value,
		});
	}
	const columns = [
		{
			title: '序号',
			align: 'center',
			width: 50,
			search: false,
			render: (text, record, index) => {
				return [(pagination.current - 1) * pagination.pageSize + index + 1];
			},
		},
		{
			title: '文章名称',
			dataIndex: 'articleTitle',
			key: 'articleTitle',
			render: (_, row) => {
				// 将书籍简介的文字进行简化
				let brief = null;
				if (row.articleTitle.length > 22) {
					brief = row.articleTitle.slice(0, 22) + '...';
				} else {
					brief = row.articleTitle;
				}
				return [brief];
			},
		},
		{
			title: '文章分类',
			dataIndex: 'typeId',
			key: 'typeId',
			align: 'center',
			renderFormItem: (
				item,
				{ type, defaultRender, formItemProps, fieldProps, ...rest },
				form,
			) => {
				return (
					<Select
						placeholder='请选择查询分类'
						onChange={(e) => handleChange({ typeId: e })}>
						{typeOptionCreator(Select, typeList)}
					</Select>
				);
			},
			render: (_, row) => {
				// 寻找对应类型的类型名称
				const type = typeList.find((item) => item._id === row.typeId);
				return [
					<Tag color='purple' key={row.typeId}>
						{type?.typeName}
					</Tag>,
				];
			},
		},
		{
			title: '上架日期',
			dataIndex: 'onShelfDate',
			key: 'onShelfDate',
			align: 'center',
			renderFormItem: (
				item,
				{ type, defaultRender, formItemProps, fieldProps, ...rest },
				form,
			) => {
				return (
					<DatePicker
						format='YYYY-MM-DD'
						disabledDate={disabledDate}
						onChange={(e) =>
							handleChange({
								onShelfDate: String(e.valueOf()),
							})
						}
						value={
							searchType?.onShelfDate
								? dayjs(Number(searchType?.onShelfDate))
								: dayjs(new Date())
						}
					/>
				);
			},
			render: (_, row) => {
				return [formatDate(row.onShelfDate)];
			},
		},
		{
			title: '操作',
			width: 200,
			key: 'option',
			valueType: 'option',
			fixed: 'right',
			align: 'center',
			render: (_, row, index, action) => {
				return [
					<div key={row._id}>
						<Button
							type='link'
							size='small'
							onClick={() => navigate(`/article/articleList/${row._id}`)}>
							详情
						</Button>
						<Button
							type='link'
							size='small'
							onClick={() => navigate(`/article/editArticle/${row._id}`)}>
							编辑
						</Button>
						<Popconfirm
							title='是否要删除该文章？'
							onConfirm={() => deleteHandle(row)}
							okText='删除'
							cancelText='取消'>
							<Button type='link' size='small'>
								删除
							</Button>
						</Popconfirm>
					</div>,
				];
			},
		},
	];

	/**
	 *
	 * @param {*} page 当前页
	 * @param {*} pageSize 每页条数
	 */
	function handlePageChange(current, pageSize) {
		setPagination({
			current,
			pageSize,
		});
	}

	async function deleteHandle(articleInfo) {
		await ArticleController.deleteArticle(articleInfo._id);
		actionRef.current.reload(); // 再次刷新请求
		message.success('删除文章成功');
	}

	return (
		<>
			<PageContainer>
				<ProTable
					headerTitle='文章列表'
					columns={columns}
					params={searchType}
					actionRef={actionRef}
					rowKey={(row) => row._id}
					onReset={() => {
						setSearchType({
							typeId: null,
							onShelfDate: undefined,
						});
					}}
					pagination={{
						showQuickJumper: true,
						showSizeChanger: true,
						pageSizeOptions: [5, 10, 20, 50, 100],
						...pagination,
						onChange: handlePageChange,
					}}
					request={async (params) => {
						const result = await ArticleController.getArticleByPage(params);
						return {
							data: result?.data?.data,
							// success 请返回 true，
							// 不然 table 会停止解析数据，即使有数据
							success: !result?.code,
							// 不传会使用 data 的长度，如果是分页一定要传
							total: result?.data?.count,
						};
					}}
				/>
			</PageContainer>
		</>
	);
}

export default Article;
