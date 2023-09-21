import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ quyền
 * Hỗ trợ phân trang
 * @returns [users]
 */
const getRoles = async () => httpClient.get('/roles');


export {
  getRoles
}