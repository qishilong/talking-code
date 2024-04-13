const recommendDetailModel = require("../models/recommendDetailModel");

module.exports.getRecommendDetailDao = function () {
  return recommendDetailModel.find();
};

/**
 * 更新 recommendDetail 字段的值
 * @param {*} newData
 * @returns
 */
module.exports.updateRecommendDetailDao = function (id, newData) {
  return recommendDetailModel.findOneAndUpdate({ _id: id }, newData, { new: true }, (err, doc) => {
    if (err) {
      console.error("Error updating recommend Detail:", err);
      throw err;
    }
  });
};

/**
 * 删除
 * @param {*} newData
 * @returns
 */
module.exports.deleteRecommendDetailDao = function (id) {
  return recommendDetailModel.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      console.error("Error updating recommend Detail:", err);
      throw err;
    }
  });
};

module.exports.addRecommendDetailDao = function (newInfo) {
  return recommendDetailModel.create(newInfo, (err, doc) => {
    if (err) {
      console.error("新增出错：", err);
    }
  });
};
