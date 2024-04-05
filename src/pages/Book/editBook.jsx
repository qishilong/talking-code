import { PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookForm from './components/bookForm';

// 请求方法
import BookController from '@/services/book';

function EditBook(props) {
  // 获取传递过来的 id
  const { id } = useParams(); // 获取可能传递过来的 id
  const [bookInfo, setBookInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // 根据问答 id 获取该问答具体的信息
      const { data } = await BookController.getBookById(id);
      setBookInfo(data);
    }
    if (id) {
      fetchData();
    }
  }, []);

  async function submitHandle(bookIntro) {
    await BookController.editBook(id, {
      bookTitle: bookInfo.bookTitle,
      bookIntro,
      downloadLink: bookInfo.downloadLink,
      requirePoints: bookInfo.requirePoints,
      bookPic: bookInfo.bookPic,
      typeId: bookInfo.typeId,
    });
    // 跳转回首页
    navigate('/book/bookList');
    message.success('书籍信息修改成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 800 }}>
        <BookForm
          type="edit"
          bookInfo={bookInfo}
          setBookInfo={setBookInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default EditBook;
