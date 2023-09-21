import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ thực đơn
 */
const getSuggestedMenus = async (status) => httpClient.get(`/suggestedmenus`,{params: {
  status: status ?? null
}});

/**
 * Tạo mới thực đơn
 * @param {*} data - object thực đơn
 * @returns SuggestedMenu
 */
const createSuggestedMenu = async (data) => httpClient.post(`/suggestedmenus`,data);

/**
 * Cập nhật thực đơn
 * @param {*} data - object thực đơn
 * @returns SuggestedMenu
 */
const updateSuggestedMenu= async (data) => httpClient.put(`/suggestedmenus`,data);

/**
 * Xóa thực đơn
 * @param {*} data - object thực đơn
 * @returns SuggestedMenu
 */
const deleteSuggestedMenu = async (id) => httpClient.delete(`/suggestedmenus`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa thực đơn
 * @param {*} data - object thực đơn
 * @returns SuggestedMenu
 */
const updateStatusSuggestedMenu = async (data) => httpClient.put(`/suggestedmenus/updatestatus`,data);



export {
  getSuggestedMenus,
  createSuggestedMenu,
  updateSuggestedMenu,
  deleteSuggestedMenu,
  updateStatusSuggestedMenu
}