import Guide from "@/components/Guide";
import { trim } from "@/utils/format";
import { PageContainer } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { useEffect, useRef } from "react";
import styles from "./index.less";

const HomePage = () => {
  const { name } = useModel("global");
  const ref = useRef();

  const run = (canvas) => {
    // const canvas = ref.current;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });
    function initCanvasSize() {
      /* 代码 `canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight *
      devicePixelRatio;`正在设置canvas元素的宽度和高度以匹配窗口的宽度和高度，乘以设备像素比率。 */
      // 用于解决清晰度问题
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
    }

    initCanvasSize();

    /**
     * getRandom 函数生成给定最小值和最大值之间的随机数。
     * @param min - 您希望随机数的最小值。
     * @param max - 随机数可以是的最大值。
     * @returns 作为参数提供的最小值和最大值之间的随机整数。
     */
    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    class Particle {
      constructor() {
        const r = Math.min(canvas.width, canvas.height) / 2;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const rad = (getRandom(0, 360) * Math.PI) / 180;
        this.x = cx + r * Math.cos(rad);
        this.y = cy + r * Math.sin(rad);
        this.size = getRandom(2 * devicePixelRatio, 7 * devicePixelRatio);
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = "#00aaffda";
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
      }
      moveTo(tx, ty) {
        // 控制每次 x, y 改变一点
        const duration = 500; // 500 ms 的运动时间
        const sx = this.x,
          sy = this.y;
        const xSpeed = (tx - sx) / duration;
        const ySpeed = (ty - sy) / duration;
        const startTime = Date.now();
        const move = () => {
          const t = Date.now() - startTime;
          const x = sx + t * xSpeed;
          const y = sy + t * ySpeed;
          this.x = x;
          this.y = y;
          if (t >= duration) {
            this.x = tx;
            this.y = ty;
            return;
          }
          requestAnimationFrame(move);
          // requestIdleCallback(move)
        };
        move();
      }
    }

    const circles = [];
    let text = null;

    const getPoints = () => {
      const points = [];
      const gap = 6;
      const { height, width, data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < width; i += gap) {
        for (let j = 0; j < height; j += gap) {
          const index = (i + j * width) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          if (r === 0 && g === 0 && b === 0 && a === 255) {
            points.push([i, j]);
          }
        }
      }
      return points;
    };

    function getText() {
      return new Date().toTimeString().substring(0, 8);
    }

    const clearText = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    function drawText() {
      const newText = getText();
      if (newText === text) {
        return;
      }
      clearText();
      text = newText;
      const { width, height } = canvas;
      ctx.fillStyle = "#000";
      ctx.textBaseline = "middle";
      ctx.font = `${200 * devicePixelRatio}px 'DS-Digital', sans-serif`;
      ctx.fillText(text, (width - ctx.measureText(text).width) / 2, height / 2);
      const points = getPoints();
      clearText();
      for (let i = 0; i < points.length; i++) {
        let p = circles[i];
        if (!p) {
          p = new Particle();
          circles.push(p);
        }
        const [x, y] = points[i];
        p.moveTo(x, y);
      }
      if (points.length < circles.length) {
        circles.splice(points.length);
      }
    }

    function createCircle() {
      clearText();
      drawText();
      circles.forEach((item) => item.draw());
      requestAnimationFrame(createCircle);
    }

    createCircle();
  };
  useEffect(() => {
    run(ref.current);
  }, []);

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {/* <div className={styles.show_style}>
					请注意，本系统为演示系统，所以请不要随意删除或者修改管理员和用户的信息！！！
				</div> */}
        <Guide name={trim(name)} />
        <canvas ref={ref}></canvas>
      </div>
    </PageContainer>
  );
};

export default HomePage;
