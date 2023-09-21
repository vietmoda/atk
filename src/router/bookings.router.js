/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/bookings',
    children: [
      {
        path: '',
        name: 'Bookings',
        component: () => import('@/views/bookings/BookingManager.vue'),
        meta: {
          title:"Trang quản lý đặt lịch dâng hương",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]