import request from "./request";
import { download } from "../utils/tool";

/**
 * 获取所有分类的文章标题
 */

export function getArticleTitle() {
  return request("/api/article/articleTitle/", {
    method: "GET"
  });
}

/**
 * 根据文章 id 获取文章
 */

export function getArticleById(articleId) {
  return request(`/api/article/${articleId}`, {
    method: "GET"
  });
}

/**
 * 根据文章 id 将文章转换为 word 格式
 */
export async function getArticleToWord(articleId, filename) {
  // 触发请求事件
  const res = await request(`/api/article/word/${articleId}`, {
    method: "GET",
    responseType: "blob" // 确保响应类型为blob
  });

  return download(filename, res);
}

/**
 * 根据文章 id 将文章转换为 markdown 格式
 */
export async function getArticleToMarkdown(articleId, filename) {
  const res = await request(`/api/article/markdown/${articleId}`, {
    method: "GET",
    responseType: "blob" // 确保响应类型为blob
  });

  return download(filename, res);
}
