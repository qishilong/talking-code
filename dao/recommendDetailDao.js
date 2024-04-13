const recommendDetailModel = require("../models/recommendDetailModel");

module.exports.getRecommendDetailDao = async function () {
  return await recommendDetailModel.find();
};

/**
 * 更新 recommendDetail 字段的值
 * @param {*} newData
 * @returns
 */
module.exports.updateRecommendDetailDao = async function (id, newData) {
  try {
    const res = await recommendDetailModel.findOneAndUpdate(
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
module.exports.deleteRecommendDetailDao = async function (id) {
  try {
    const res = await recommendDetailModel.findByIdAndDelete(id);
    if (res) {
      return res;
    }
    throw new Error("删除失败", 500);
  } catch (error) {
    throw error;
  }
};

module.exports.addRecommendDetailDao = async function (newInfo) {
  try {
    const res = await recommendDetailModel.create(newInfo);
    if (res) {
      return res;
    }
    throw new Error("添加失败", 500);
  } catch (error) {
    throw error;
  }
};
