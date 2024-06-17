const jwt = require("jsonwebtoken");
const md5 = require("md5");
exports.publish = (res, maxAge = 3600 * 24, info = {}) => {
  const token = jwt.sign(info, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
  // 设置cookie
  res.cookie(process.env.COOKIEKEY, token, {
    maxAge: maxAge,
    path: "/",
    httponly: true
  });
  // 通过设置请求头的方式返回给前端，前端可在请求头中获取JWT信息
  res.header["authorization"] = token;
};

exports.verify = (req) => {
  let token;
  // 从 cookie 中获取
  token = req.cookies[process.env.COOKIEKEY];
  // 如果cookie中没有，则从请求头中获取
  if (!token) {
    token = req.get("Authorization");
    if (!token) {
      return null;
    }
    // authorization: bearer token
    // 获取JWT
    token = token.split(" ");
    token = token.length === 1 ? token[0] : token[1];
  }
  try {
    // 验证JWT是否合法
    const result = jwt.verify(token, md5(process.env.JWT_SECRET));
    return result;
  } catch (err) {
    return null;
  }
};
