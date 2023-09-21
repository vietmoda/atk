/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/restore',
    children: [
      {
        path: '',
        name: 'Restore',
        component: () => import('@/views/restore/LogCommandsManager.vue'),
        meta: {
          title: "Trang khôi phục dữ liệu",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]