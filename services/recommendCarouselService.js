const {
  getRecommendCarouselDao,
  updateRecommendCarouselDao,
  deleteRecommendCarouselDao,
  addRecommendCarouselDao
} = require("../dao/recommendCarouselDao");

module.exports.getRecommendCarouselService = async function () {
  return await getRecommendCarouselDao();
};

module.exports.updateRecommendCarouselService = async function (id, newData) {
  return await updateRecommendCarouselDao(id, newData);
};

module.exports.deleteRecommendCarouselService = async function (id) {
  return await deleteRecommendCarouselDao(id);
};

module.exports.addRecommendCarouselService = async function (newData) {
  return await addRecommendCarouselDao(newData);
};
