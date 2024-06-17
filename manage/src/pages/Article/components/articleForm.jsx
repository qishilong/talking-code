import { typeOptionCreator } from "@/utils/tool";
import "@toast-ui/editor/dist/i18n/zh-cn";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "umi";

function ArticleForm({ type, submitHandle, articleInfo, setArticleInfo }) {
  const formRef = useRef();
  const dispatch = useDispatch();
  const editorRef = useRef();
  const [firstIn, setFirstIn] = useState(true);

  useEffect(() => {
    // 这里需要注意的就是关于有 markdown 编辑器时数据的回填
    if (formRef.current && firstIn && articleInfo) {
      // 关键就是关于编辑器的回填
      editorRef.current.getInstance().setHTML(articleInfo?.articleContent);
      // 将 firstIn 设置为 false
      setFirstIn(false);
    }
    if (formRef.current) {
      formRef.current.setFieldsValue(articleInfo);
    }
  }, [articleInfo]);

  // 从仓库获取类型列表
  const { typeList } = useSelector((state) => state.type);

  // 如果类型列表为空，则初始化一次
  if (!typeList.length) {
    dispatch({
      type: "type/_initTypeList"
    });
  }

  // 用户填写内容时更新表单控件内容
  function updateInfo(newInfo, key) {
    const newArticleInfo = { ...articleInfo };
    if (typeof newInfo === "string") {
      newArticleInfo[key] = newInfo.trim();
    } else if (typeof newInfo === "object") {
      newArticleInfo[key] = String(newInfo.valueOf());
    } else {
      newArticleInfo[key] = newInfo;
    }
    setArticleInfo(newArticleInfo);
  }

  const handleChange = (value) => {
    updateInfo(value, "typeId");
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  /**
   * 首先获取 md 编辑器中的内容，然后再手动触发 submitHandle
   */
  function addHandle() {
    const content = editorRef.current.getInstance().getHTML();
    submitHandle(content);
  }

  return (
    <Form
      name='basic'
      initialValues={articleInfo}
      autoComplete='off'
      ref={formRef}
      onFinish={addHandle}
    >
      {/* 文章标题 */}
      <Form.Item
        label='文章标题'
        name='articleTitle'
        rules={[{ required: true, message: "请输入文章标题" }]}
      >
        <Input
          placeholder='填写文章标题'
          value={articleInfo?.articleTitle}
          onChange={(e) => updateInfo(e.target.value, "articleTitle")}
        />
      </Form.Item>

      <Form.Item label='上架时间'>
        <DatePicker
          format='YYYY-MM-DD HH:mm:ss'
          disabledDate={disabledDate}
          showTime={true}
          showToday={true}
          showNow={true}
          value={dayjs(Number(articleInfo?.onShelfDate) || dayjs(new Date()))}
          onChange={(e) => updateInfo(e, "onShelfDate")}
        />
      </Form.Item>

      {/* 文章所属分类 */}
      <Form.Item
        label='文章分类'
        name='typeId'
        rules={[{ required: true, message: "请选择文章所属分类" }]}
      >
        <Select style={{ width: 200 }} onChange={handleChange} allowClear>
          {typeOptionCreator(Select, typeList)}
        </Select>
      </Form.Item>

      {/* 文章解答 */}
      <Form.Item
        label='文章内容'
        name='articleContent'
        rules={[{ required: true, message: "请输入文章解答" }]}
      >
        <Editor
          initialValue=''
          previewStyle='vertical'
          height='600px'
          initialEditType='markdown'
          useCommandShortcut={true}
          language='zh-CN'
          ref={editorRef}
        />
      </Form.Item>

      {/* 确认修改按钮 */}
      <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          {type === "add" ? "确认新增" : "修改"}
        </Button>

        <Button
          type='link'
          className='resetBtn'
          onClick={() => {
            setArticleInfo({
              articleTitle: "",
              articleContent: "",
              onShelfDate: "",
              typeId: ""
            });
            editorRef.current.getInstance().setHTML("");
          }}
        >
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ArticleForm;
