// 运行时配置
import AdminController from "@/services/admin";
import { message } from "antd";
import type { RequestConfig } from "umi";
import { history } from "umi";
import img from "./favicon.png";

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  if (location.pathname === "/login") {
    // 强行跳登录页
    // 判断是否有有效的 token
    const token = localStorage.getItem("adminToken");
    if (token) {
      const result = await AdminController.getInfo();
      if (result.data) {
        // 不仅有 token，而且 token 是有效的
        // 不允许你去 login
        message.warning("请先退出后再登录");
        history.go(-1);
      }
    }
  } else {
    // 强行要跳内部页面
    const result = await AdminController.getInfo();
    if (result.data) {
      // 说明有 token，并且 token 有效
      // 获取该 id 对应的管理员信息
      const { data } = await AdminController.getAdminById(result.data._id);
      // 这里返回的就是一个全局的初始化数据
      // 之后各个组件都可以通过 useModel 获取到该初始数据
      return {
        name: data.nickname,
        avatar: data.avatar,
        adminInfo: data
      };
    } else {
      // token 验证失败，跳转至登录
      // 失效可能是因为 token 过期，也有可能是因为压根儿就没有 token，不管有没有，删除掉原有的
      localStorage.removeItem("adminToken");
      Promise.resolve()
        .then(() => message.warning("登录过期，请重新登录"))
        .then(() => (location.href = "/login"));
    }
  }
}

export const layout = () => {
  return {
    logo: img,
    menu: {
      locale: false
    },
    logout: () => {
      // 删除本地 token
      localStorage.removeItem("adminToken");
      // 跳转到登录页面
      location.href = "/login";
      message.success("退出登录成功");
    }
  };
};

export const request: RequestConfig = {
  timeout: 3000,
  // 请求拦截器
  requestInterceptors: [
    function (url: any, options: any) {
      // 从本地获取 token
      const token = localStorage.getItem("adminToken");
      if (token) {
        options.headers["Authorization"] = "Bearer " + token;
      }
      return { url, options };
    }
  ],
  responseInterceptors: [
    // 直接写一个 function，作为拦截器
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (response) => {
        return response;
      },
      (error) => {
        message.error(error.message);
        return Promise.reject(error);
      }
    ]
  ]
};

export function onRouteChange({ location }: any) {
  const { pathname } = location;
  const lastPath = pathname.split("/").pop();
  const path = [
    {
      from: "admin",
      to: "/admin/adminList"
    },
    {
      from: "user",
      to: "/user/userList"
    },
    {
      from: "book",
      to: "/book/bookList"
    },
    {
      from: "article",
      to: "/article/articleList"
    }
  ];
  path.forEach((item) => {
    if (item.from === lastPath) {
      history.push(item.to);
    }
  });
}
