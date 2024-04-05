const jwt = require("jsonwebtoken");
const md5 = require("md5");
exports.publish = (res, maxAge = 3600 * 24, info = {}) => {
  const token = jwt.sign(info, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
  res.cookie(process.env.COOKIEKEY, token, {
    maxAge: maxAge,
    path: "/",
    httponly: true
  });
  // 添加其他位置传输
  res.header["authorization"] = token;
};

exports.verify = (req) => {
  let token;
  // 从 cookie 中获取
  token = req.cookies[process.env.COOKIEKEY];
  if (!token) {
    token = req.get("Authorization");
    if (!token) {
      return null;
    }
    // authorization: bearer token
    token = token.split(" ");
    token = token.length === 1 ? token[0] : token[1];
  }
  try {
    const result = jwt.verify(token, md5(process.env.JWT_SECRET));
    return result;
  } catch (err) {
    return null;
  }
};
