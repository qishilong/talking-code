/**
 * 书籍模块对应二级路由
 */

const express = require("express");
const router = express.Router();

// 引入业务层方法
const {
  addBookService,
  findBookByPageService,
  findBookByIdService,
  updateBookService,
  deleteBookService
} = require("../services/bookService");

const { formatResponse } = require("../utils/tools");

/**
 * 根据分页获取书籍
 */
router.get("/", async function (req, res) {
  const result = await findBookByPageService(req.query);
  return res.send(formatResponse(0, "", result));
});

/**
 * 获取其中一本书籍信息
 */
router.get("/:id", async function (req, res) {
  const result = await findBookByIdService(req.params.id);
  return res.send(formatResponse(0, "", result));
});

/**
 * 新增书籍
 */
router.post("/", async function (req, res, next) {
  const result = await addBookService(req.body);
  if (result && result._id) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

/**
 * 删除书籍
 */
router.delete("/:id", async function (req, res) {
  const result = await deleteBookService(req.params.id);
  return res.send(formatResponse(0, "", result));
});

/**
 * 修改书籍
 */
router.patch("/:id", async function (req, res) {
  const result = await updateBookService(req.params.id, req.body);
  return res.send(formatResponse(0, "", result));
});

module.exports = router;
