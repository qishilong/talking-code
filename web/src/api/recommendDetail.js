import request from "./request";

export function getRecommendDetail() {
  return request("/api/recommendDetail", {
    method: "GET"
  });
}
