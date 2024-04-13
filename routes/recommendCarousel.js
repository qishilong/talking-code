const express = require("express");
const router = express.Router();
const {
  getRecommendCarouselService,
  updateRecommendCarouselService,
  deleteRecommendCarouselService,
  addRecommendCarouselService
} = require("../services/recommendCarouselService");

const { formatResponse } = require("../utils/tools");

router.get("/", async (req, res, next) => {
  const result = await getRecommendCarouselService();
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

router.patch("/update/:id", async (req, res, next) => {
  const result = await updateRecommendCarouselService(req.params.id, req.body);
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

router.delete("/:id", async (req, res, next) => {
  const result = await deleteRecommendCarouselService(req.params.id);
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

router.post("/add", async (req, res, next) => {
  const result = await addRecommendCarouselService(req.body);
  if (result) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

module.exports = router;
