import React from "react";
import { Tooltip } from "antd";

import styles from "../css/RecommendItem.module.css";

function RecommendItem(props) {
  return (
    <a
      className={styles.container}
      href={props?.recommendInfo?.href}
      target='_blank'
      rel='noreferrer'
    >
      <div className={styles.leftSide}>{props?.recommendInfo?.num}</div>
      <Tooltip
        title={
          props?.recommendInfo?.title ? (
            <div className={styles.tooltipStyles}>{props?.recommendInfo?.title}</div>
          ) : null
        }
        destroyTooltipOnHide={true}
        color='#fff'
      >
        <div className={styles.rightSide}>{props?.recommendInfo?.title}</div>
      </Tooltip>
    </a>
  );
}

export default RecommendItem;
