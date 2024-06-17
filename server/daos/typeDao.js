// 引入模型
const typeModel = require("../models/typeModel");

/**
 * 查询所有类型
 */
module.exports.findAllTypeDao = async function (queryObj) {
  if (!queryObj || Reflect.ownKeys(queryObj).length === 0) {
    return await typeModel.find();
  }
  const pageObj = {
    currentPage: Number(queryObj.current),
    pageSize: Number(queryObj.pageSize)
  };
  pageObj.count = await typeModel.countDocuments();
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.pageSize);

  try {
    pageObj.data = await typeModel.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "typeId",
          as: "relatedBooks"
        }
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "typeId",
          as: "relatedArticles"
        }
      },
      {
        $lookup: {
          from: "issues",
          localField: "_id",
          foreignField: "typeId",
          as: "relatedIssues"
        }
      },
      {
        $project: {
          _id: 1,
          typeName: 1,
          numberOfBooks: { $size: "$relatedBooks" },
          numberOfArticles: { $size: "$relatedArticles" },
          numberOfIssues: { $size: "$relatedIssues" }
        }
      },
      {
        $skip: (pageObj.currentPage - 1) * pageObj.pageSize
      },
      {
        $limit: pageObj.pageSize
      }
    ]);

    pageObj.allData = await typeModel.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "typeId",
          as: "relatedBooks"
        }
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "typeId",
          as: "relatedArticles"
        }
      },
      {
        $lookup: {
          from: "issues",
          localField: "_id",
          foreignField: "typeId",
          as: "relatedIssues"
        }
      },
      {
        $project: {
          _id: 1,
          typeName: 1,
          numberOfBooks: { $size: "$relatedBooks" },
          numberOfArticles: { $size: "$relatedArticles" },
          numberOfIssues: { $size: "$relatedIssues" }
        }
      }
    ]);
  } catch (error) {
    throw error;
  }

  return pageObj;
};

/**
 * 新增类型
 */
module.exports.addTypeDao = async function (newTypeInfo) {
  return await typeModel.create(newTypeInfo);
};

/**
 * 根据 id 删除类型
 */
module.exports.deleteTypeDao = async function (id) {
  return typeModel.deleteOne({
    _id: id
  });
};

/**
 * 根据 id 修改类型
 */
module.exports.updateTypeDao = async function (id, newInfo) {
  return typeModel.updateOne({ _id: id }, newInfo);
};

/**
 * 根据类型名称查找某一个类型
 */

module.exports.findTypeByTypeName = async function (typeName) {
  return await typeModel.find({ typeName });
};
