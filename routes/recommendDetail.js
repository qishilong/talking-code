const express = require("express");
const router = express.Router();
const {
  getRecommendDetailService,
  updateRecommendDetailService,
  deleteRecommendDetailService,
  addRecommendDetailService
} = require("../services/recommendDetailService");

const { formatResponse } = require("../utils/tools");

router.get("/", async (req, res, next) => {
  const result = await getRecommendDetailService();
  return res.send(formatResponse(0, "", result));
  if (result) {
  } else {
    next(result);
  }
});

router.patch("/update/:id", async (req, res, next) => {
  const result = await updateRecommendDetailService(req.params.id, req.body);
  return res.send(formatResponse(0, "", result));
  if (result) {
  } else {
    next(result);
  }
});

router.delete("/:id", async (req, res, next) => {
  const result = await deleteRecommendDetailService(req.params.id);
  return res.send(formatResponse(0, "", result));
  if (result) {
  } else {
    next(result);
  }
});

router.post("/add", async (req, res, next) => {
  const result = await addRecommendDetailService(req.body);
  return res.send(formatResponse(0, "", result));
  if (result) {
  } else {
    next(result);
  }
});

module.exports = router;
