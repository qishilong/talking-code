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
  return res.send(formatResponse(0, "", result));
});

router.patch("/update/:id", async (req, res, next) => {
  const result = await updateRecommendCarouselService(req.params.id, req.body);
  return res.send(formatResponse(0, "", result));
});

router.delete("/:id", async (req, res, next) => {
  console.log(req.params.id, 11);

  const result = await deleteRecommendCarouselService(req.params.id);
  return res.send(formatResponse(0, "", result));
});

router.post("/add", async (req, res, next) => {
  const result = await addRecommendCarouselService(req.body);
  return res.send(formatResponse(0, "", result));
  if (result) {
  } else {
    next(result);
  }
});

module.exports = router;
