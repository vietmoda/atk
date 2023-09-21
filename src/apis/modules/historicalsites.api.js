import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ di tich
 */
const getHistoricalSites = async (status) => httpClient.get(`/historicalsites`, {
    params: {
        status: status ?? null
    }
});

/**
 * Tạo mới di tich
 * @param {*} data - object di tich
 * @returns HistoricalSites
 */
const createHistoricalSites = async (data) => httpClient.post(`/historicalsites`, data);

/**
 * Cập nhật thực đơn
 * @param {*} data - object di tich
 * @returns HistoricalSites
 */
const updateHistoricalSites = async (data) => httpClient.put(`/historicalsites`, data);

/**
 * Xóa thực đơn
 * @param {*} data - object di tich
 * @returns HistoricalSites
 */
const deleteHistoricalSites = async (id) => httpClient.delete(`/historicalsites`, { data: { _id: id } });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa di tich
 * @param {*} data - object di tich
 * @returns HistoricalSites
 */
const updateStatusHistoricalSites = async (data) => httpClient.put(`/historicalsites/updatestatus`, data);



export {
    getHistoricalSites,
    createHistoricalSites,
    updateHistoricalSites,
    deleteHistoricalSites,
    updateStatusHistoricalSites
}