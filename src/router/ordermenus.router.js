/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/ordermenus',
    children: [
      {
        path: '',
        name: 'OrderMenus',
        component: () => import('@/views/ordermenus/OrderManager.vue'),
        meta: {
          title:"Trang quản lý đặt bàn",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]