import httpClient from '@/apis/httpClient';

/**
 * Lấy danh sách toàn bộ Booking
 */
const getBookings = async (status) => httpClient.get(`/bookings`,{params: {
  status: status ?? null
}});

/**
 * Lấy danh sách Bookings theo loại danh mục
 * @param {*} status Trạng thái hoạt động/ không hoạt động
 * @param {*} processStatus 
 * @param {*} keyword 
 * @param {*} currentPage 
 * @param {*} itemPerPage 
 * @returns Bookings
 */
const getBookingsPaging = async (status, processStatus, keyword, currentPage, itemPerPage) => httpClient.get(`/bookings/getpaging`,{params: {
  status: status ?? null,
  processstatus: processStatus ?? null,
  keyword: keyword ?? null,
  currentpage: currentPage ?? null,
  itemperpage: itemPerPage ?? null
}});
/**
 * Lấy tổng số Bookings, dùng cho phân trang
 * @param {*} status Trạng thái hoạt động/ không hoạt động
 * @param {*} newsStatus 
 * @param {*} keyword 
 * @returns Bookings
 */
const getCountBookingsPaging = async (status, processStatus, keyword) => httpClient.get(`/bookings/count`,{params: {
  status: status ?? null,
  processstatus: processStatus ?? null,
  keyword: keyword ?? null,
}});

/**
 * Tạo mới Booking
 * @param {*} data - object Booking
 * @returns Booking
 */
const createBooking = async (data) => httpClient.post(`/bookings`,data);

/**
 * Cập nhật Booking
 * @param {*} data - object Booking
 * @returns Booking
 */
const updateBooking = async (data) => httpClient.put(`/bookings`,data);

/**
 * Xóa Booking
 * @param {*} data - object Booking
 * @returns Booking
 */
const deleteBooking = async (id) => httpClient.delete(`/bookings`,{ data: {_id: id} });


/**
 * Cập nhật trạng thái hoạt động/không hoạt động/xóa Booking
 * @param {*} data - object Booking
 * @returns Booking
 */
const updateStatusBooking = async (data) => httpClient.put(`/bookings/updatestatus`,data);

/**
 * Cập nhật tiến trình xử lý Booking
 * @param {*} data - object Booking
 * @returns Booking
 */
const updateBookingProcess = async (data) => httpClient.put(`/bookings/updateprocess`,data);


export {
  getBookings,
  getBookingsPaging,
  getCountBookingsPaging,
  createBooking,
  updateBooking,
  deleteBooking,
  updateStatusBooking,
  updateBookingProcess
}