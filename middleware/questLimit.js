const { formatResponse } = require("../utils/tools");

module.exports = async (req, res, next) => {
  const limitOptions = {
    duration: 10,
    nums: 10000,
    message: "您的请求过于频繁，请稍后再试",
    limit: 60
  };
  const now = Date.now();
  if (!Number.isInteger(req.session.nums)) {
    // 如果这时第一次请求，设置请求次数为0
    req.session.nums = 0;
  }
  if (!Number.isInteger(req.session.begin)) {
    req.session.begin = now;
  }
  if (!Number.isInteger(req.session.timeout)) {
    // 设置默认的过期时间
    req.session.timeout = limitOptions.limit * 1000;
  }

  // 记录请求的次数，包括这次
  let currentNum = ++req.session.nums;
  const dis = now - req.session.begin;
  // 默认过期时间
  const timeout = req.session.timeout;
  if (dis > timeout) {
    // 说明请求时间已超过最大限制，可以重新请求
    currentNum = req.session.nums = 1;
    req.session.begin = now;
    req.session.timeout = limitOptions.limit * 1000;
  } else {
    // 时间还没有过去，看请求次数是否超过
    if (currentNum > limitOptions.nums) {
      // 说明当前的次数已超过最大值，禁止请求
      return res.status(403).send(formatResponse(403, limitOptions.message, { data: null }));
    }
  }

  if (currentNum === limitOptions.nums) {
    req.session.begin = now;
    req.session.timeout = limitOptions.duration * 1000;
  }
  await next();
};
