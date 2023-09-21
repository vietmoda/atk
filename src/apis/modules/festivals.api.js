import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ lễ hội
 */
const getFestivals = async (status) => httpClient.get(`/historicalsites/festivals`, {
    params: {
        status: status ?? null
    }
});

/**
 * Lấy danh sách lễ hội theo di tích lịch sử
 * @param {*} historicalSiteId - mã di tích lịch sử
 * @param {*} status - Trạng thái
 * @returns items
 */
const getFestivalByHistoricalSiteId = async (historicalSiteId, status) => httpClient.get(`/historicalsites/festivals/byhistoricalsiteid`, {
    params: {
        historicalsiteid: historicalSiteId ?? null,
        status: status ?? null,
    }
});


/**
 * Tạo mới lễ hội
 * @param {*} data - object lễ hội
 * @returns Festival
 */
const createFestival = async (data) => httpClient.post(`/historicalsites/festivals`, data);

/**
 * Cập nhật lễ hội
 * @param {*} data - object lễ hội
 * @returns Festival
 */
const updateFestival = async (data) => httpClient.put(`/historicalsites/festivals`, data);

/**
 * Xóa lễ hội
 * @param {*} data - object lễ hội
 * @returns Festival
 */
const deleteFestival = async (id) => httpClient.delete(`/historicalsites/festivals`, { data: { _id: id } });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa lễ hội
 * @param {*} data - object lễ hội
 * @returns Festival
 */
const updateStatusFestival = async (data) => httpClient.put(`/historicalsites/festivals/updatestatus`, data);



export {
    getFestivals,
    getFestivalByHistoricalSiteId,
    createFestival,
    updateFestival,
    deleteFestival,
    updateStatusFestival
}