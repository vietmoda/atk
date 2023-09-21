import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ WebLink
 */
const getWebLinks = async (status) => httpClient.get(`/weblinks`,{params: {
  status: status ?? null
}});

/**
 * Lấy danh sách WebLink theo loại danh mục
 * @param {*} categoryId - mã loại danh mục
 * @param {*} status - Trạng thái
 * @returns WebLink
 */
const getWebLinkByCategoryId = async (categoryId, status) => httpClient.get(`/weblinks/bycategoryid`,{params: {
  categoryid: categoryId ?? null,
  status: status ?? null,
}});

/**
 * Tạo mới WebLink
 * @param {*} data - object WebLink
 * @returns WebLink
 */
const createWebLink = async (data) => httpClient.post(`/weblinks`,data);

/**
 * Cập nhật WebLink
 * @param {*} data - object WebLink
 * @returns WebLink
 */
const updateWebLink = async (data) => httpClient.put(`/weblinks`,data);

/**
 * Xóa WebLink
 * @param {*} data - object WebLink
 * @returns WebLink
 */
const deleteWebLink = async (id) => httpClient.delete(`/weblinks`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa WebLink
 * @param {*} data - object WebLink
 * @returns WebLink
 */
const updateStatusWebLink = async (data) => httpClient.put(`/weblinks/updatestatus`,data);



export {
  getWebLinks,
  getWebLinkByCategoryId,
  createWebLink,
  updateWebLink,
  deleteWebLink,
  updateStatusWebLink
}