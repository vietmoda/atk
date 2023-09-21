import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ tài khoản người dùng
 * Hỗ trợ phân trang
 * @returns [users]
 */
const getUsers = async ({ page, limit }) => httpClient.get('/users', {
  params: {
    page: page ?? 1,
    limit: limit ?? 10
  }
});

/**
 * Lấy thông tin của một tài khoản người dùng
 * @param {*} userId - mã người dùng
 * @returns user
 */
const getUserInfo = async (userId) => httpClient.get(`/user/${userId}`);

/**
 * Khởi tạo tài khoản mới
 * @param {*} body 
 * @returns {} thông tin tài khoản đã được tạo
 */
const addUser = async (body) => httpClient.post(`/users`, body);

/**
 * Cập nhật thông tin tài khoản
 * @param {*} body 
 */
const updateUser = async (body) => httpClient.put(`/users`, body);

const deleteUser = async (userId) => httpClient.delete(`/users`, { data: { _id: userId } });

export {
  getUsers,
  getUserInfo,
  addUser,
  updateUser,
  deleteUser
}