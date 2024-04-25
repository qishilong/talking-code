import { useState, useEffect, useMemo } from "react";
import { Comment, Tooltip, Avatar, message } from "antd";
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from "@ant-design/icons";
import { likeOrDislikeCommentById } from "../api/comment";
import { formatDate } from "../utils/tool";
import { useSelector } from "react-redux";

function AntdComment(params) {
  const { props } = params;

  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [dislikeNumber, setDislikeNumber] = useState(0);

  const { userInfo: curUserInfo, isLogin } = useSelector((state) => state?.user);

  useEffect(() => {
    setLike(props?.commentLike.includes(curUserInfo?.loginId));
    setDislike(props?.commentDislike.includes(curUserInfo?.loginId));
    setLikeNumber(props?.commentLike.length);
    setDislikeNumber(props?.commentDislike.length);
  }, [curUserInfo, isLogin]);

  // 处理点赞行为
  const handleLike = async () => {
    // 用户未登录
    if (!isLogin) {
      message.info("请先登录");
      return;
    }
    // 判断是点赞还是取消点赞
    const type = like ? "cancelLike" : "like";
    // 发送请求
    const res = await likeOrDislikeCommentById(props?._id, {
      type: type,
      user: curUserInfo?.loginId
    });
    if (!res) {
      message.error("操作失败");
    } else {
      // 判断是点赞还是取消点赞
      if (type === "cancelLike") {
        // 取消点赞
        setLike(false);
        // 减少点赞数
        setLikeNumber((prev) => {
          return prev - 1;
        });
      } else {
        // 处理点赞成功后点踩数和点赞数的逻辑
        if (dislike) {
          setDislikeNumber((prev) => {
            return prev - 1;
          });
        }
        setLike(true);
        setDislike(false);
        setLikeNumber((prev) => {
          return prev + 1;
        });
      }
    }
  };

  // 处理点踩行为
  const handleDislike = async () => {
    // 用户未登录
    if (!isLogin) {
      message.info("请先登录");
      return;
    }
    // 判断是点踩还是取消点踩
    const type = dislike ? "cancelDislike" : "dislike";
    const res = await likeOrDislikeCommentById(props?._id, {
      type: type,
      user: curUserInfo?.loginId
    });
    if (!res) {
      message.error("操作失败");
    } else {
      // 判断是点踩还是取消点踩
      if (type === "cancelDislike") {
        // 取消点踩
        setDislike(false);
        // 减少点踩数
        setDislikeNumber((prev) => {
          return prev - 1;
        });
      } else {
        // 处理点踩成功后点赞数和点踩数的逻辑
        setDislike(true);
        if (like) {
          setLikeNumber((prev) => {
            return prev - 1;
          });
        }
        setLike(false);
        setDislikeNumber((prev) => {
          return prev + 1;
        });
      }
    }
  };

  const actions = useMemo(() => {
    return [
      <>
        <span
          style={{
            cursor: "pointer"
          }}
          onClick={handleLike}
        >
          {like ? <LikeFilled /> : <LikeOutlined />}
          <span
            style={{
              paddingLeft: "8px"
            }}
          >
            {likeNumber}
          </span>
        </span>
        <span
          style={{
            cursor: "pointer",
            paddingLeft: "8px"
          }}
          onClick={handleDislike}
        >
          {dislike ? <DislikeFilled /> : <DislikeOutlined />}
          <span
            style={{
              paddingLeft: "8px"
            }}
          >
            {dislikeNumber}
          </span>
        </span>
      </>
    ];
  }, [like, dislike, likeNumber, dislikeNumber]);

  return (
    <Comment
      actions={actions}
      avatar={<Avatar src={props?.userId?.avatar} />}
      content={<div dangerouslySetInnerHTML={{ __html: props?.commentContent }}></div>}
      datetime={
        <Tooltip title={formatDate(props?.commentDate)}>
          <span>{formatDate(props?.commentDate, "year")}</span>
        </Tooltip>
      }
      author={props?.userId?.nickname ?? ""}
    />
  );
}

export default AntdComment;
