import request from "./request";

export function getRecommendCarousel() {
  return request("/api/recommendCarousel", {
    method: "GET"
  });
}
