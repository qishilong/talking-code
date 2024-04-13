const recommendCarouselModel = require("../models/recommendCarouselModel");

module.exports.getRecommendCarouselDao = function () {
  return recommendCarouselModel.find();
};

/**
 * 更新 recommendCarousel 字段的值
 * @param {*} newData
 * @returns
 */
module.exports.updateRecommendCarouselDao = function (id, newData) {
  return recommendCarouselModel.findOneAndUpdate(
    { _id: id },
    newData,
    { new: true },
    (err, doc) => {
      if (err) {
        console.error("Error updating recommend carousel:", err);
        throw err;
      }
    }
  );
};

/**
 * 删除
 * @param {*} newData
 * @returns
 */
module.exports.deleteRecommendCarouselDao = function (id) {
  return recommendCarouselModel.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      console.error("Error delete recommend carousel:", err);
      throw err;
    }
  });
};

module.exports.addRecommendCarouselDao = function (newInfo) {
  return recommendCarouselModel.create(newInfo, (err, doc) => {
    if (err) {
      console.error("新增出错：", err);
    }
  });
};
