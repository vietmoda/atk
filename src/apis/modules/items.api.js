import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ danh mục chi tiết
 */
const getItems = async (status) => httpClient.get(`/items`,{params: {
  status: status ?? null
}});

/**
 * Lấy danh sách danh mục chi tiết theo loại danh mục
 * @param {*} categoryId - mã loại danh mục
 * @param {*} status - Trạng thái
 * @returns items
 */
const getItemByCategoryId = async (categoryId, status) => httpClient.get(`/items/bycategoryid`,{params: {
  categoryid: categoryId ?? null,
  status: status ?? null,
}});


/**
 * Tạo mới danh mục chi tiết
 * @param {*} data - object danh mục chi tiết
 * @returns Item
 */
const createItem = async (data) => httpClient.post(`/items`,data);

/**
 * Cập nhật danh mục chi tiết
 * @param {*} data - object danh mục chi tiết
 * @returns Item
 */
const updateItem = async (data) => httpClient.put(`/items`,data);

/**
 * Xóa danh mục chi tiết
 * @param {*} data - object danh mục chi tiết
 * @returns Item
 */
const deleteItem = async (id) => httpClient.delete(`/items`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa danh mục chi tiết
 * @param {*} data - object danh mục chi tiết
 * @returns Item
 */
const updateStatusItem = async (data) => httpClient.put(`/items/updatestatus`,data);



export {
  getItems,
  getItemByCategoryId,
  createItem,
  updateItem,
  deleteItem,
  updateStatusItem
}