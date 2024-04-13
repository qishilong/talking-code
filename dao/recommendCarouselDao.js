const recommendCarouselModel = require("../models/recommendCarouselModel");

module.exports.getRecommendCarouselDao = async function () {
  return await recommendCarouselModel.find();
};

/**
 * 更新 recommendCarousel 字段的值
 * @param {*} newData
 * @returns
 */
module.exports.updateRecommendCarouselDao = async function (id, newData) {
  try {
    const res = await recommendCarouselModel.findOneAndUpdate(
      { _id: id },
      { $set: newData },
      { new: true }
    );
    if (res) {
      return res;
    }
    throw new Error("更新失败", 500);
  } catch (error) {
    throw error;
  }
};

/**
 * 删除
 * @param {*} newData
 * @returns
 */
module.exports.deleteRecommendCarouselDao = async function (id) {
  try {
    const res = await recommendCarouselModel.findByIdAndDelete(id);
    if (res) {
      return res;
    }
    throw new Error("删除失败", 500);
  } catch (error) {
    throw error;
  }
};

module.exports.addRecommendCarouselDao = async function (newInfo) {
  try {
    const res = await recommendCarouselModel.create(newInfo);
    if (res) {
      return res;
    }
    throw new Error("添加失败", 500);
  } catch (error) {
    throw error;
  }
};
