import request from "./request";

/**
 * 获取所有分类的文章标题
 */

export function getArticleTitle() {
  return request("/api/article/articleTitle/", {
    method: "GET",
  });
}

/**
 * 根据文章 id 获取文章
 */

export function getArticleById(articleId) {
  return request(`/api/article/${articleId}`, {
    method: "GET",
  });
}
