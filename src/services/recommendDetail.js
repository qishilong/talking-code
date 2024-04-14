import { request } from "@umijs/max";

export function getRecommendDetail() {
  return request("/api/recommendDetail", {
    method: "GET"
  });
}

export function updateRecommendDetail(id, newData) {
  return request(`/api/recommendDetail/update/${id}`, {
    method: "PATCH",
    data: newData
  });
}

export function deleteRecommendDetail(id) {
  return request(`/api/recommendDetail/${id}`, {
    method: "DELETE"
  });
}

export function addRecommendDetail(newData) {
  return request("/api/recommendDetail/add", {
    method: "POST",
    data: newData
  });
}
