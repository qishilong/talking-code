import {
  addRecommendDetail,
  deleteRecommendDetail,
  updateRecommendDetail
} from "@/services/recommendDetail";
import { Button, Input, Tooltip, message } from "antd";
import { isEqual } from "lodash-es";
import type { Dispatch, FC, SetStateAction } from "react";
import { useRef, useState } from "react";
import styles from "./listItem.module.less";

interface ListItemProps {
  title: string;
  href: string;
  _id?: string;
  curIndex: number;
  setRenderList: Dispatch<SetStateAction<boolean>>;
  canAdd: boolean;
  canDel: boolean;
}

const ListItem: FC<ListItemProps> = ({
  title,
  href,
  canAdd,
  canDel,
  setRenderList,
  curIndex,
  _id
}) => {
  const [titleVal, setTitleVal] = useState<string>(title);
  const [hrefVal, setHrefVal] = useState<string>(href);
  const [editStatus, setEditStatus] = useState<boolean>(false);

  const originRef = useRef({
    title: title,
    href: href
  });

  return (
    <div className={styles.container}>
      <div className={styles.handle}>
        <span className={styles.left}>位置</span>
        <div className={styles.right}>
          <Button
            type='link'
            onClick={async () => {
              if (editStatus) {
                const newData = {
                  title: titleVal,
                  href: hrefVal
                };
                console.log(newData, originRef.current, isEqual(newData, originRef.current), 11);

                if (isEqual(newData, originRef.current)) {
                  setEditStatus(false);
                } else {
                  try {
                    const res = await updateRecommendDetail(_id, newData);
                    if (res.code === 0) {
                      setEditStatus(false);
                      originRef.current = newData;
                      message.success("更新成功");
                    } else {
                      message.error("更新失败");
                    }
                  } catch (error) {
                    message.error("更新失败");
                  }
                }
              } else {
                setEditStatus(true);
              }
            }}
          >
            {editStatus ? "完成" : "修改"}
          </Button>
          {canAdd ? (
            <Button
              type='link'
              onClick={async () => {
                const newData = {
                  title: "默认推荐标题",
                  href: "#",
                  curIndex: curIndex + 1
                };
                try {
                  const res = await addRecommendDetail(newData);

                  if (res.code === 0) {
                    message.success("新增成功");
                    setRenderList((prev) => !prev);
                  } else {
                    message.error("新增失败");
                  }
                } catch (err: any) {
                  message.error("新增失败");
                }
              }}
            >
              添加
            </Button>
          ) : (
            <Tooltip title='最多10条'>
              <Button type='link' disabled={true}>
                添加
              </Button>
            </Tooltip>
          )}
          {canDel ? (
            <Button
              type='link'
              danger={true}
              onClick={async () => {
                try {
                  const res = await deleteRecommendDetail(_id);
                  if (res.code === 0) {
                    message.success("删除成功");
                    setRenderList((prev) => !prev);
                  } else {
                    message.error("删除失败");
                  }
                } catch (err) {
                  message.error("删除失败");
                }
              }}
            >
              删除
            </Button>
          ) : (
            <Tooltip title='最少一条'>
              <Button type='link' disabled={true}>
                删除
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.index}>{curIndex}</span>
        <div className={styles.right}>
          <div className={styles.title}>
            <span className={styles.text}>标题</span>
            <Tooltip title={titleVal} placement='top'>
              <Input
                className={styles.titleVal}
                value={titleVal}
                variant='borderless'
                onChange={(e) => {
                  setTitleVal(e.target.value);
                }}
                disabled={!editStatus}
              />
            </Tooltip>
          </div>
          <div className={styles.href}>
            <span className={styles.text}>标题跳转地址</span>
            <Tooltip title={hrefVal} placement='top'>
              <Input
                className={styles.hrefUrl}
                value={hrefVal}
                variant='borderless'
                onChange={(e) => {
                  setHrefVal(e.target.value);
                }}
                disabled={!editStatus}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
