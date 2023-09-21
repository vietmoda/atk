import httpClient from '@/apis/httpClient';


/**
 * Lấy danh sách Logs theo phân trang
 * @param {*} actiontype 
 * @param {*} collectionname 
 * @param {*} keyword 
 * @param {*} startdate 
 * @param {*} enddate 
 * @param {*} currentPage 
 * @param {*} itemPerPage 
 * @returns 
 */
const getLogs = async (actiontype, collectionname, keyword, startdate, enddate, currentPage, itemPerPage) => httpClient.get(`/logcommands/searchlog`,{params: {
  actiontype: actiontype ?? null,
  collectionname: collectionname ?? null,
  keyword: keyword ?? null,
  startdate: startdate ?? null,
  enddate: enddate ?? null,
  currentpage: currentPage ?? null,
  itemperpage: itemPerPage ?? null
}});

/**
 * Lấy tổng số để phân tran
 * @param {*} actiontype 
 * @param {*} collectionname 
 * @param {*} keyword 
 * @param {*} startdate 
 * @param {*} enddate 
 * @returns 
 */
const getCountLogs= async (actiontype, collectionname, keyword, startdate, enddate) => httpClient.get(`/logcommands/count`,{params: {
  actiontype: actiontype ?? null,
  collectionname: collectionname ?? null,
  keyword: keyword ?? null,
  startdate: startdate ?? null,
  enddate: enddate ?? null,
}});


export {
  getLogs,
  getCountLogs,
}