import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ OrderMenu
 */
const getOrderMenus = async (status) => httpClient.get(`/ordermenus`,{params: {
  status: status ?? null
}});

/**
 * Lấy danh sách OrderMenus theo loại danh mục
 * @param {*} status Trạng thái hoạt động/ không hoạt động
 * @param {*} processStatus 
 * @param {*} keyword 
 * @param {*} currentPage 
 * @param {*} itemPerPage 
 * @returns OrderMenus
 */
const getOrderMenusPaging = async (status, processStatus, keyword, currentPage, itemPerPage) => httpClient.get(`/ordermenus/getpaging`,{params: {
  status: status ?? null,
  processstatus: processStatus ?? null,
  keyword: keyword ?? null,
  currentpage: currentPage ?? null,
  itemperpage: itemPerPage ?? null
}});
/**
 * Lấy tổng số OrderMenus, dùng cho phân trang
 * @param {*} status Trạng thái hoạt động/ không hoạt động
 * @param {*} newsStatus 
 * @param {*} keyword 
 * @returns OrderMenus
 */
const getCountOrderMenusPaging = async (status, processStatus, keyword) => httpClient.get(`/ordermenus/count`,{params: {
  status: status ?? null,
  processstatus: processStatus ?? null,
  keyword: keyword ?? null,
}});

/**
 * Tạo mới OrderMenu
 * @param {*} data - object OrderMenu
 * @returns OrderMenu
 */
const createOrderMenu = async (data) => httpClient.post(`/ordermenus`,data);

/**
 * Cập nhật OrderMenu
 * @param {*} data - object OrderMenu
 * @returns OrderMenu
 */
const updateOrderMenu = async (data) => httpClient.put(`/ordermenus`,data);

/**
 * Xóa OrderMenu
 * @param {*} data - object OrderMenu
 * @returns OrderMenu
 */
const deleteOrderMenu = async (id) => httpClient.delete(`/ordermenus`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa OrderMenu
 * @param {*} data - object OrderMenu
 * @returns OrderMenu
 */
const updateStatusOrderMenu = async (data) => httpClient.put(`/ordermenus/updatestatus`,data);

/**
 * Cập nhật tiến trình xử lý OrderMenu
 * @param {*} data - object OrderMenu
 * @returns OrderMenu
 */
const updateOrderMenuProcess = async (data) => httpClient.put(`/ordermenus/updateprocess`,data);


export {
  getOrderMenus,
  getOrderMenusPaging,
  getCountOrderMenusPaging,
  createOrderMenu,
  updateOrderMenu,
  deleteOrderMenu,
  updateStatusOrderMenu,
  updateOrderMenuProcess
}