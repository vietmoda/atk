import httpClient from '@/apis/httpClient';

/**
 * Đăng nhập bằng username và passwork
 * @param {*} {username, password} 
 * @returns access_token
 */
const login = async ({username, password}) => httpClient.put('/users/login', {username, password});

/**
 * Đăng xuất một tài khoản trên server để clear cache
 * @param {*} username 
 * @returns status
 */
const logout = async (username) => httpClient.post('/logout', username);

export {
  login,
  logout
}