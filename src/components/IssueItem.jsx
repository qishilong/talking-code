import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTypeList } from "../redux/typeSlice";
import { useSelector, useDispatch } from "react-redux";
import { Tag, message } from "antd";
import styles from "../css/IssueItem.module.css";
import { getUserById } from "../api/user";
import { formatDate } from "../utils/tool";
import { likeOrDislikeIssueById } from "../api/issue";
import {
  CommentOutlined,
  EyeOutlined,
  LikeOutlined,
  DislikeOutlined,
  LikeFilled,
  DislikeFilled
} from "@ant-design/icons";

function IssueItem(props) {
  const navigate = useNavigate();
  // 从仓库获取类型列表
  const { typeList } = useSelector((state) => state.type);
  const { userInfo: curUserInfo, isLogin } = useSelector((state) => state?.user);

  const dispatch = useDispatch();
  const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
  useEffect(() => {
    if (!typeList.length) {
      dispatch(getTypeList());
    }
  }, []);

  const [likeNumber, setLikeNumber] = useState(props.issueInfo.issueLike.length);
  const [dislikeNumber, setDislikeNumber] = useState(props.issueInfo.issueDislike.length);

  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  useEffect(() => {
    setLike(props?.issueInfo.issueLike.includes(curUserInfo?.loginId));
    setDislike(props?.issueInfo?.issueDislike.includes(curUserInfo?.loginId));
  }, [curUserInfo, isLogin]);

  const type = typeList.find((item) => item?._id === props?.issueInfo?.typeId);
  return (
    <div className={styles.container}>
      <div className={styles.top} onClick={() => navigate(`/issues/${props?.issueInfo?._id}`)}>
        {props?.issueInfo?.issueTitle}
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <Tag color='volcano'>{props?.issueInfo?.userId?.nickname}</Tag>
          <span className={styles.split}></span>
          <span className={styles.icon}>
            <CommentOutlined />
            {props?.issueInfo?.commentNumber}
          </span>
          <span className={styles.icon}>
            <EyeOutlined />
            {props?.issueInfo?.scanNumber}
          </span>
          <span
            className={styles.icon}
            style={{
              cursor: "pointer"
            }}
            onClick={async () => {
              if (!isLogin) {
                message.info("请先登录");
                return;
              }
              const type = like ? "cancelLike" : "like";
              const res = await likeOrDislikeIssueById(props?.issueInfo?._id, {
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
            {likeNumber}
          </span>
          <span
            className={styles.icon}
            style={{
              cursor: "pointer"
            }}
            onClick={async () => {
              if (!isLogin) {
                message.info("请先登录");
                return;
              }
              const type = dislike ? "cancelDislike" : "dislike";
              const res = await likeOrDislikeIssueById(props?.issueInfo?._id, {
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
            {dislikeNumber}
          </span>
        </div>
        <div className={styles.right}>
          <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
          <span>{formatDate(props?.issueInfo?.issueDate, "year")}</span>
        </div>
      </div>
    </div>
  );
}

export default IssueItem;
