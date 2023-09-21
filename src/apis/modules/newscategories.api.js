import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ chuyên mục
 */
const getNewsCategories = async (status, type) => httpClient.get(`/newscategories`,{params: {
  status: status ?? null,
  type: type ?? null,
}});

/**
 * Lấy danh sách chuyên mục dạng cây
 * @param {*} status Trạng thái => lấy STATUS_xxx trong file constant.js
 * @param {*} type Loại chuyên mục => lấy NEW_CATEGORY_TYPE trong file constant.js
 * @param {*} flatt 0: Lấy theo dạng cây; 1-Lấy theo dạng phẳng
 * @returns 
 */
const getTreeNewsCategories = async (status, type, flatt) => httpClient.get(`/newscategories/tree`,{params: {
  status: status ?? null,
  type: type ?? null,
  flatt: flatt ?? null,
}});

/**
 * Tạo mới chuyên mục
 * @param {*} data - object chuyên mục
 * @returns NewsCategories
 */
const createNewsCategories = async (data) => httpClient.post(`/newscategories`,data);

/**
 * Cập nhật chuyên mục
 * @param {*} data - object chuyên mục
 * @returns NewsCategories
 */
const updateNewsCategories = async (data) => httpClient.put(`/newscategories`,data);

/**
 * Xóa chuyên mục
 * @param {*} data - object chuyên mục
 * @returns NewsCategories
 */
const deleteNewsCategories = async (id) => httpClient.delete(`/newscategories`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa chuyên mục
 * @param {*} data - object chuyên mục
 * @returns NewsCategories
 */
const updateStatusNewsCategories = async (data) => httpClient.put(`/newscategories/updatestatus`,data);



export {
  getNewsCategories,
  getTreeNewsCategories,
  createNewsCategories,
  updateNewsCategories,
  deleteNewsCategories,
  updateStatusNewsCategories
}