const recommendCarouselModel = require("../models/recommendCarouselModel");
const mongoose = require("mongoose");

module.exports.getRecommendCarouselDao = async function () {
  return await recommendCarouselModel.find().sort({ curIndex: 1 });
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
    const allData = await recommendCarouselModel.find().sort({ curIndex: 1 });
    const newData = allData.slice(allData.findIndex((item) => String(item._id) === id) + 1);
    for (const item of newData) {
      await recommendCarouselModel.findByIdAndUpdate(
        item._id,
        { $inc: { curIndex: -1 } },
        { new: true }
      );
    }
    const res = await recommendCarouselModel.findByIdAndDelete(id);
    if (res) {
      return res;
    }
    throw new Error("删除失败", 500);
  } catch (error) {
    throw error;
  }
};

/**
 * 新增
 * @param {*} newInfo
 * @returns
 */
module.exports.addRecommendCarouselDao = async function (newInfo) {
  try {
    const curIndex = newInfo.curIndex;
    const allData = await recommendCarouselModel.find().sort({ curIndex: 1 });
    for (const item of allData) {
      if (item.curIndex >= curIndex) {
        await recommendCarouselModel.findByIdAndUpdate(
          item._id,
          { $inc: { curIndex: 1 } },
          { new: true }
        );
      }
    }
    const res = await recommendCarouselModel.create(newInfo);
    if (res) {
      return res;
    }
    throw new Error("添加失败", 500);
  } catch (error) {
    throw error;
  }
};
