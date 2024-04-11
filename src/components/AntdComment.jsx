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

  const actions = useMemo(() => {
    return [
      <>
        <span
          style={{
            cursor: "pointer"
          }}
          onClick={async () => {
            if (!isLogin) {
              message.info("请先登录");
              return;
            }
            const type = like ? "cancelLike" : "like";
            const res = await likeOrDislikeCommentById(props?._id, {
              type: type,
              user: curUserInfo?.loginId
            });
            if (!res) {
              message.error("操作失败");
            } else {
              if (type === "cancelLike") {
                setLike(false);
                setLikeNumber((prev) => {
                  return prev - 1;
                });
              } else {
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
          }}
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
          onClick={async () => {
            if (!isLogin) {
              message.info("请先登录");
              return;
            }
            const type = dislike ? "cancelDislike" : "dislike";
            const res = await likeOrDislikeCommentById(props?._id, {
              type: type,
              user: curUserInfo?.loginId
            });
            if (!res) {
              message.error("操作失败");
            } else {
              if (type === "cancelDislike") {
                setDislike(false);
                setDislikeNumber((prev) => {
                  return prev - 1;
                });
              } else {
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
          }}
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
