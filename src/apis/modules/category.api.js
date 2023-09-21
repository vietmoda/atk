import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ danh mục
 */
const getCategories = async (status) => httpClient.get(`/categories`,{params: {
  status: status ?? null
}});

/**
 * Tạo mới danh mục
 * @param {*} data - object danh mục
 * @returns Category
 */
const createCategory = async (data) => httpClient.post(`/categories`,data);

/**
 * Cập nhật danh mục
 * @param {*} data - object danh mục
 * @returns Category
 */
const updateCategory= async (data) => httpClient.put(`/categories`,data);

/**
 * Xóa danh mục
 * @param {*} data - object danh mục
 * @returns Category
 */
const deleteCategory = async (id) => httpClient.delete(`/categories`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa danh mục
 * @param {*} data - object danh mục
 * @returns Category
 */
const updateStatusCategory = async (data) => httpClient.put(`/categories/updatestatus`,data);



export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateStatusCategory
}