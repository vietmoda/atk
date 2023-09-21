import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ video
 */
const getVideos = async (status) => httpClient.get(`/videos`,{params: {
  status: status ?? null
}});

/**
 * Lấy danh sách video theo loại danh mục
 * @param {*} categoryId - mã loại danh mục
 * @param {*} status - Trạng thái
 * @returns video
 */
const getVideoByCategoryId = async (categoryId, status) => httpClient.get(`/videos/bycategoryid`,{params: {
  categoryid: categoryId ?? null,
  status: status ?? null,
}});

/**
 * Tạo mới video
 * @param {*} data - object video
 * @returns Video
 */
const createVideo = async (data) => httpClient.post(`/videos`,data);

/**
 * Cập nhật video
 * @param {*} data - object video
 * @returns Video
 */
const updateVideo = async (data) => httpClient.put(`/videos`,data);

/**
 * Xóa video
 * @param {*} data - object video
 * @returns Video
 */
const deleteVideo = async (id) => httpClient.delete(`/videos`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa video
 * @param {*} data - object video
 * @returns Video
 */
const updateStatusVideo = async (data) => httpClient.put(`/videos/updatestatus`,data);



export {
  getVideos,
  getVideoByCategoryId,
  createVideo,
  updateVideo,
  deleteVideo,
  updateStatusVideo
}