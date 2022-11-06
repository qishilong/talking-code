import request from "./request";

/**
 * 获取所有分类的面试题标题
 */

export function getArticleTitle() {
  return request("/api/article/articleTitle/", {
    method: "GET",
  });
}

/**
 * 根据面试题 id 获取面试题
 */

export function getArticleById(articleId) {
  return request(`/api/article/${articleId}`, {
    method: "GET",
  });
}
