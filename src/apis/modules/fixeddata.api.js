import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách loại chuyên mục
 */
const getNewsCategoryType = async () => httpClient.get('/fixeddata/newscategorytype');

/**
 * Lấy danh sách loại hiển thị weblink
 */
const getWebLinkViewType = async () => httpClient.get('/fixeddata/weblinkviewtype');


export {
  getNewsCategoryType,
  getWebLinkViewType
}