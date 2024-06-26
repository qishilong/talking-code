import { download } from "@/utils/tool";
import { request } from "@umijs/max";

/**
 * 获取所有的管理员
 */
function getAdmin(params) {
  return request("/api/admin", {
    method: "GET",
    params: {
      ...params
    }
  });
}

/**
 * 删除管理员
 */
function deleteAdmin(adminId) {
  return request(`/api/admin/${adminId}`, {
    method: "DELETE"
  });
}

/**
 * 修改管理员信息
 */
function editAdmin(adminId, newAdminInfo) {
  return request(`/api/admin/${adminId}`, {
    method: "PATCH",
    data: newAdminInfo
  });
}

/**
 * 新增管理员
 */
function addAdmin(newAdminInfo) {
  return request("/api/admin", {
    method: "POST",
    data: newAdminInfo
  });
}

/**
 * 根据 loginId 查找管理员
 */
function adminIsExist(loginId) {
  return request(`/api/admin/adminIsExist/${loginId}`, {
    method: "GET"
  });
}

/**
 * 获取验证码
 */

function getCaptcha() {
  return request("/res/captcha", {
    method: "GET"
  });
}

/**
 * 管理员登录
 */
function login(loginInfo) {
  return request("/api/admin/login", {
    method: "POST",
    data: loginInfo
  });
}

/**
 * 恢复登录状态
 */

function getInfo() {
  return request("/api/admin/whoami", {
    method: "GET"
  });
}

/**
 * 根据 id 获取管理员
 */
function getAdminById(adminId) {
  return request(`/api/admin/${adminId}`, {
    method: "GET"
  });
}

/**
 * 下载管理员列表模版
 */
async function getExcelFile() {
  const response = await request("/api/admin/download/adminComplete", {
    method: "GET",
    responseType: "blob" // 确保响应类型为blob
  });
  download("管理员列表模版.xlsx", response);
}

export default {
  getAdmin,
  deleteAdmin,
  editAdmin,
  addAdmin,
  adminIsExist,
  getCaptcha,
  login,
  getInfo,
  getAdminById,
  getExcelFile
};
