import httpClient from '@/apis/httpClient';

/**
 * Xóa file
 * @param {*} id - id file
 * @returns file
 */
const deleteFile = async (id) => httpClient.delete(`/files`,{ data: {fileid: id} });

/**
 * Xóa nhiều file
 * @param {*} listfileid - list id file
 * @returns file
 */
const deleteMultiFile = async (listfileid) => httpClient.delete(`/files/multi`,{ data: {listfileid: listfileid} });

export {
  deleteFile,
  deleteMultiFile
}