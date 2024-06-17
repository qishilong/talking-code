/**
 * 评论对应的二级路由
 */

const express = require("express");
const router = express.Router();

const {
  findCommentByPageAndTypeService,
  addCommentService,
  deleteCommentService,
  findIssueCommentByIdService,
  findBookCommentByIdService,
  updateCommentService,
  updateCommentLikeOrDislikeService
} = require("../services/commentService");

const { formatResponse } = require("../utils/tools");
const { async } = require("validate.js");

/**
 * 按照分页查询对应模块的评论
 */
router.get("/:commentType", async function (req, res) {
  const result = await findCommentByPageAndTypeService(req.params.commentType, req.query);
  // 对返回数据进行格式化
  return res.send(formatResponse(0, "", result));
});

/**
 * 按照分页获取问答模块某一问题对应的评论
 */
router.get("/issuecomment/:id", async function (req, res) {
  const result = await findIssueCommentByIdService(req.params.id, req.query);
  return res.send(formatResponse(0, "", result));
});

/**
 * 按照分页获取书籍模块某一本书对应的评论
 */
router.get("/bookcomment/:id", async function (req, res) {
  const result = await findBookCommentByIdService(req.params.id, req.query);
  return res.send(formatResponse(0, "", result));
});

/**
 * 新增评论
 */
router.post("/", async function (req, res, next) {
  const result = await addCommentService(req.body);
  if (result && result._id) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

/**
 * 根据 id 删除评论
 */
router.delete("/:id", async function (req, res) {
  const result = await deleteCommentService(req.params.id);
  return res.send(formatResponse(0, "", result));
});

/**
 * 根据 id 修改评论
 */
router.patch("/update/:id", async function (req, res) {
  const result = await updateCommentService(req.params.id, req.body);
  return res.send(formatResponse(0, "", result));
});

/**
 * 根据 id 点赞或者点踩
 */
router.patch("/likeOrDislike/:id", async function (req, res) {
  const result = await updateCommentLikeOrDislikeService(req.params.id, req.body);
  return res.send(formatResponse(0, "", result));
});

module.exports = router;
