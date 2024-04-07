import { request } from "umi";

/**
 * 分页获取文章
 */
function getArticleByPage(params) {
  return request("/api/article", {
    method: "GET",
    params: {
      ...params
    }
  });
}

/**
 * 根据 id 获取文章
 */
function getArticleById(articleId) {
  return request(`/api/article/${articleId}`, {
    method: "GET"
  });
}

/**
 * 新增文章
 */
function addArticle(newArticleInfo) {
  return request("/api/article", {
    method: "POST",
    data: newArticleInfo
  });
}

/**
 * 根据 id 删除文章
 */
function deleteArticle(articleId) {
  return request(`/api/article/${articleId}`, {
    method: "DELETE"
  });
}

/**
 * 根据 id 编辑器
 */
function editArticle(articleId, newArticleInfo) {
  return request(`/api/article/${articleId}`, {
    method: "PATCH",
    data: newArticleInfo
  });
}

export default {
  getArticleByPage,
  getArticleById,
  addArticle,
  deleteArticle,
  editArticle
};
