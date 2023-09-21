import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ Album
 */
const getAlbums = async (status) => httpClient.get(`/albums`,{params: {
  status: status ?? null
}});

/**
 * Lấy danh sách Album theo loại danh mục
 * @param {*} categoryId - mã loại danh mục
 * @param {*} status - Trạng thái
 * @returns Album
 */
const getAlbumByCategoryId = async (categoryId, status) => httpClient.get(`/albums/bycategoryid`,{params: {
  categoryid: categoryId ?? null,
  status: status ?? null,
}});


/**
 * Tạo mới Album
 * @param {*} data - object Album
 * @returns Album
 */
const createAlbum = async (data) => httpClient.post(`/albums`,data);

/**
 * Tạo mới AlbumMulti
 * @param {*} data - object Album
 * @returns Album
 */
const createAlbumMulti = async (data) => httpClient.post(`/albums/multi`,data);


/**
 * Cập nhật Album
 * @param {*} data - object Album
 * @returns Album
 */
const updateAlbum = async (data) => httpClient.put(`/albums`,data);

/**
 * Xóa Album
 * @param {*} data - object Album
 * @returns Album
 */
const deleteAlbum = async (id) => httpClient.delete(`/albums`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa Album
 * @param {*} data - object Album
 * @returns Album
 */
const updateStatusAlbum = async (data) => httpClient.put(`/albums/updatestatus`,data);



export {
  getAlbums,
  getAlbumByCategoryId,
  createAlbum,
  createAlbumMulti,
  updateAlbum,
  deleteAlbum,
  updateStatusAlbum
}