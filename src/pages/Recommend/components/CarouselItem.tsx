import {
  addRecommendCarousel,
  deleteRecommendCarousel,
  updateRecommendCarousel
} from "@/services/recommendCarousel";
import { PlusOutlined } from "@ant-design/icons";
import { request } from "@umijs/max";
import { Button, Image, Input, Tooltip, message } from "antd";
import { isEqual } from "lodash-es";
import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import { useRef, useState } from "react";
import styles from "./carouselItem.module.less";

interface CarouselItemProps {
  imageUrl: string;
  href: string;
  _id?: string;
  curIndex: number;
  setRenderCarouselList: Dispatch<SetStateAction<boolean>>;
  canAdd: boolean;
  canDel: boolean;
}

const DesItem: FC<CarouselItemProps> = ({
  imageUrl,
  href,
  curIndex,
  setRenderCarouselList,
  canAdd,
  _id,
  canDel
}) => {
  const [imageUrlVal, setImageUrlVal] = useState<string>(imageUrl);
  const [hrefVal, setHrefVal] = useState<string>(href);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [editStatus, setEditStatus] = useState<boolean>(false);

  const originRef = useRef({
    imageUrl: imageUrl,
    href: href
  });

  const inputUploadFn = async (e: ChangeEvent<HTMLInputElement>) => {
    const imgData = e.target.files![0];
    const formData = new FormData();
    formData.append("file", imgData, imgData?.name);
    const data = await request("/api/upload", {
      method: "POST",
      data: formData
    });
    if (data.code === 0) {
      setImageUrlVal(`${window.location.origin}${data.data}`);
      return;
    } else {
      message.error("上传失败");
    }
  };

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
                  imageUrl: imageUrlVal,
                  href: hrefVal
                };
                if (isEqual(newData, originRef.current)) {
                  setEditStatus(false);
                } else {
                  try {
                    const res = await updateRecommendCarousel(_id, newData);
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
                  imageUrl: "#",
                  href: "#",
                  curIndex: curIndex + 1
                };
                try {
                  const res = await addRecommendCarousel(newData);

                  if (res.code === 0) {
                    message.success("新增成功");
                    setRenderCarouselList((prev) => !prev);
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
                  const res = await deleteRecommendCarousel(_id);
                  if (res.code === 0) {
                    message.success("删除成功");
                    setRenderCarouselList((prev) => !prev);
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
          <div className={styles.avatar}>
            <div className={styles["image-text"]}>图片</div>
            <div className={styles.image}>
              <Image src={imageUrlVal} height={80} width={80} />
              <div
                className={`${styles["upload-div"]} 
                ${styles[editStatus ? "upload-div-normal" : "upload-div-disabled"]}`}
                onClick={(e) => {
                  if (editStatus) {
                    uploadInputRef.current?.click();
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <PlusOutlined />
              </div>
            </div>
          </div>
          <div className={styles.url}>
            <span className={styles.text}>图片地址</span>
            <Tooltip title={imageUrlVal} placement='top'>
              <Input
                className={styles.imageUrl}
                value={imageUrlVal}
                variant='borderless'
                onChange={(e) => {
                  setImageUrlVal(e.target.value);
                }}
                disabled={!editStatus}
              />
            </Tooltip>
          </div>
          <div className={styles.href}>
            <span className={styles.text}>图片跳转地址</span>
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
      <input
        ref={uploadInputRef}
        onChange={inputUploadFn}
        style={{
          display: "none"
        }}
        type='file'
        accept='image/*'
      />
    </div>
  );
};

export default DesItem;
