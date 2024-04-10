import { Component } from "react";
import style from "../css/ErrorBoundary.module.css";
import { Button } from "antd";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      time: 60
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    // console.log('error:', error);
    // console.log('errorInfo:', errorInfo);
  }

  countDown() {
    setTimeout(() => {
      location.reload();
    }, 30000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={style.error_boundary_div}>
          <div className={style.text_style}>
            哎呀，出错了😅。。。
            <br />
            服务器太累了，请稍后再重试吧！！！
          </div>
          <Button
            onClick={() => this.countDown()}
            type='primary'
            className={style.button_style}
            size='large'
          >
            {`点击将尝试 ${this.state.time} 秒后自动刷新页面...`}
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
