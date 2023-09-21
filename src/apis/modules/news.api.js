import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ News
 */
const getNews = async (status) => httpClient.get(`/news`,{params: {
  status: status ?? null
}});

/**
 * Lấy thông tin bài viết theo id
 * @param {*} id mã bài viết
 * @returns News
 */
const getNewsById = async (id) => httpClient.get(`/news/getbyid`,{params: {
  _id: id ?? null
}});

/**
 * Lấy danh sách News theo loại danh mục
 * @param {*} categoryId mã loại danh mục
 * @param {*} status Trạng thái hoạt động/ không hoạt động
 * @param {*} newsStatus 
 * @param {*} keyword 
 * @param {*} currentPage 
 * @param {*} itemPerPage 
 * @returns News
 */
const getNewsByCategoryId = async (categoryId, status, newsStatus, keyword, currentPage, itemPerPage) => httpClient.get(`/news/bycategoryid`,{params: {
  categoryid: categoryId ?? null,
  status: status ?? null,
  newsstatus: newsStatus ?? null,
  keyword: keyword ?? null,
  currentpage: currentPage ?? null,
  itemperpage: itemPerPage ?? null
}});
/**
 * Lấy tổng số bài viết, dùng cho phân trang
 * @param {*} categoryId mã loại danh mục
 * @param {*} status Trạng thái hoạt động/ không hoạt động
 * @param {*} newsStatus 
 * @param {*} keyword 
 * @returns News
 */
const getCountNewsByCategoryId = async (categoryId, status, newsStatus, keyword) => httpClient.get(`/news/countbycategoryid`,{params: {
  categoryid: categoryId ?? null,
  status: status ?? null,
  newsstatus: newsStatus ?? null,
  keyword: keyword ?? null,
}});

/**
 * Tạo mới News
 * @param {*} data - object News
 * @returns News
 */
const createNews = async (data) => httpClient.post(`/news`,data);

/**
 * Cập nhật News
 * @param {*} data - object News
 * @returns News
 */
const updateNews = async (data) => httpClient.put(`/news`,data);

/**
 * Xóa News
 * @param {*} data - object News
 * @returns News
 */
const deleteNews = async (id) => httpClient.delete(`/news`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa News
 * @param {*} data - object News
 * @returns News
 */
const updateStatusNews = async (data) => httpClient.put(`/news/updatestatus`,data);



export {
  getNews,
  getNewsById,
  getNewsByCategoryId,
  getCountNewsByCategoryId,
  createNews,
  updateNews,
  deleteNews,
  updateStatusNews
}