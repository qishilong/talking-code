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
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

router.patch("/update/:id", async (req, res, next) => {
  const result = await updateRecommendDetailService(req.params.id, req.body);
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

router.delete("/:id", async (req, res, next) => {
  const result = await deleteRecommendDetailService(req.params.id);
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

router.post("/add", async (req, res, next) => {
  const result = await addRecommendDetailService(req.body);
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

module.exports = router;
