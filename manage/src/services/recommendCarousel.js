import { request } from "@umijs/max";

export function getRecommendCarousel() {
  return request("/api/recommendCarousel", {
    method: "GET"
  });
}

export function updateRecommendCarousel(id, newData) {
  return request(`/api/recommendCarousel/update/${id}`, {
    method: "PATCH",
    data: newData
  });
}

export function deleteRecommendCarousel(id) {
  return request(`/api/recommendCarousel/${id}`, {
    method: "DELETE"
  });
}

export function addRecommendCarousel(newData) {
  return request("/api/recommendCarousel/add", {
    method: "POST",
    data: newData
  });
}
