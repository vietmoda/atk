import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ nhóm quyền
 * Hỗ trợ phân trang
 * @returns [users]
 */
const getGroupRole = async (status) => httpClient.get(`/groups`,{params: {
  status: status ?? null
}});

/**
 * Tạo mới nhóm quyền
 * @param {*} data - object nhóm quyền
 * @returns groupRole
 */
const createGroupRole = async (data) => httpClient.post(`/groups`,data);

/**
 * Cập nhật nhóm quyền
 * @param {*} data - object nhóm quyền
 * @returns groupRole
 */
const updateGroupRole = async (data) => httpClient.put(`/groups`,data);

/**
 * Xóa nhóm quyền
 * @param {*} data - object nhóm quyền
 * @returns groupRole
 */
const deleteGroupRole = async (groupID) => httpClient.delete(`/groups`,{ data: {_id: groupID} });


/**
 * Cập nhật trạng thái Khóa / mở khóa nhóm quyền
 * @param {*} data - object nhóm quyền
 * @returns groupRole
 */
const updateStatus = async (data) => httpClient.put(`/groups/updatestatus`,data);



export {
  getGroupRole,
  createGroupRole,
  updateGroupRole,
  deleteGroupRole,
  updateStatus
}