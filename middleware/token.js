const { publish, verify } = require("./jwt");
const { pathToRegexp } = require("path-to-regexp");
const { ValidationError } = require("../utils/errors");

const noNeedTokenApi = [
  {
    method: "POST",
    path: "/api/admin/login"
  },
  {
    method: "GET",
    path: "/res/captcha"
  },
  {
    method: "GET",
    path: "/api/article"
  },
  {
    method: "GET",
    path: "/api/article"
  },
  {
    method: "GET",
    path: "/api/article/articleTitle"
  },
  {
    method: "GET",
    path: "/api/article/:id"
  },
  {
    method: "GET",
    path: "/api/book"
  },
  {
    method: "GET",
    path: "/api/book/:id"
  },
  {
    method: "GET",
    path: "/api/comment/:commentType"
  },
  {
    method: "GET",
    path: "/api/comment/issuecomment/:id"
  },
  {
    method: "GET",
    path: "/api/comment/bookcomment/:id"
  },
  {
    method: "GET",
    path: "/api/issue"
  },
  {
    method: "GET",
    path: "/api/issue/:id"
  },
  {
    method: "GET",
    path: "/api/issue/:id"
  },
  {
    method: "GET",
    path: "/api/type"
  },
  {
    method: "POST",
    path: "/api/user"
  },
  {
    method: "POST",
    path: "/api/user/login"
  },
  {
    method: "POST",
    path: "/api/user/passwordcheck"
  },
  {
    method: "GET",
    path: "/api/user/userIsExist/:loginId"
  },
  {
    method: "GET",
    path: "/api/user/:id"
  }
];

// 用于解析 token
module.exports = (req, res, next) => {
  const apis = noNeedTokenApi.filter((item) => {
    const path = pathToRegexp(item.path);
    return req.method === item.method && path.test(req.path);
  });
  if (apis.length > 0) {
    next();
    return;
  }
  const result = verify(req);
  if (result) {
    // 认证通过
    req.userId = result._id;
    next();
  } else {
    // 认证失败
    next(new ValidationError("身份认证失败"));
  }
};
