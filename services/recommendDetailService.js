const {
  getRecommendDetailDao,
  updateRecommendDetailDao,
  deleteRecommendDetailDao,
  addRecommendDetailDao
} = require("../dao/recommendDetailDao");

module.exports.getRecommendDetailService = async function () {
  return await getRecommendDetailDao();
};

module.exports.updateRecommendDetailService = async function (id, newData) {
  return await updateRecommendDetailDao(id, newData);
};

module.exports.deleteRecommendDetailService = async function (id) {
  return await deleteRecommendDetailDao(id);
};

module.exports.addRecommendDetailService = async function (newData) {
  return await addRecommendDetailDao(newData);
};
