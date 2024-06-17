const recommendDetailModel = require("../models/recommendDetailModel");

module.exports.getRecommendDetailDao = async function () {
  return await recommendDetailModel.find().sort({ curIndex: 1 });
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
    const allData = await recommendDetailModel.find().sort({ curIndex: 1 });
    const newData = allData.slice(allData.findIndex((item) => String(item._id) === id) + 1);
    for (const item of newData) {
      await recommendDetailModel.findByIdAndUpdate(
        item._id,
        { $inc: { curIndex: -1 } },
        { new: true }
      );
    }
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
    const curIndex = newInfo.curIndex;
    const allData = await recommendDetailModel.find().sort({ curIndex: 1 });
    for (const item of allData) {
      if (item.curIndex >= curIndex) {
        await recommendDetailModel.findByIdAndUpdate(
          item._id,
          { $inc: { curIndex: 1 } },
          { new: true }
        );
      }
    }
    const res = await recommendDetailModel.create(newInfo);
    if (res) {
      return res;
    }
    throw new Error("添加失败", 500);
  } catch (error) {
    throw error;
  }
};
