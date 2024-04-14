import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { FC } from "react";
import styles from "./desItem.module.less";

interface DesItemProps {
  imageUrl: string;
  href: string;
  _id?: string;
  index: number;
}
const DesItem: FC<DesItemProps> = ({ imageUrl, href, index }) => {
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    // const image = new Image();
    const image = document.createElement("img");
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span className={styles.up}>位置</span>
        <span className={styles.down}>{index}</span>
      </div>
      <div className={styles.right}>
        <div className={styles.avatar}>
          <div className={styles["image-text"]}>图片</div>
          <div className={styles.image}>
            <Image
              src={"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
              height={80}
              width={140}
            />
            <Upload
              style={{
                width: "80px",
                height: "80px"
              }}
              action='/api/upload'
              listType='picture-card'
              maxCount={1}
              onChange={(e) => {
                if (e.file.status === "done") {
                  // 说明上传已经完成
                  const url = e.file.response.data;
                  // handleAvatar(url, "avatar");
                  console.log(url);
                }
              }}
              headers={{
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
              }}
              onPreview={onPreview}
            >
              <PlusOutlined />
            </Upload>
          </div>
        </div>
        <div className={styles.url}>
          <span>图片地址</span>
          <span>{imageUrl}</span>
        </div>
        <div className={styles.href}>
          <span>图片跳转地址</span>
          <span>{href}</span>
        </div>
      </div>
    </div>
  );
};

export default DesItem;
