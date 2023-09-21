import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ tham số hệ thống
 */
const getSystemConfigs = async (status) => httpClient.get(`/systemconfigs`,{params: {
  status: status ?? null
}});

/**
 * Tạo mới tham số hệ thống
 * @param {*} data - object tham số hệ thống
 * @returns SystemConfig
 */
const createSystemConfig = async (data) => httpClient.post(`/systemconfigs`,data);

/**
 * Cập nhật tham số hệ thống
 * @param {*} data - object tham số hệ thống
 * @returns SystemConfig
 */
const updateSystemConfig= async (data) => httpClient.put(`/systemconfigs`,data);

/**
 * Xóa tham số hệ thống
 * @param {*} data - object tham số hệ thống
 * @returns SystemConfig
 */
const deleteSystemConfig = async (id) => httpClient.delete(`/systemconfigs`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa tham số hệ thống
 * @param {*} data - object tham số hệ thống
 * @returns SystemConfig
 */
const updateStatusSystemConfig = async (data) => httpClient.put(`/systemconfigs/updatestatus`,data);



export {
  getSystemConfigs,
  createSystemConfig,
  updateSystemConfig,
  deleteSystemConfig,
  updateStatusSystemConfig
}