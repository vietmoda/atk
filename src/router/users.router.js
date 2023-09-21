/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/users',
    children: [
      {
        path: '',
        name: 'Users',
        component: () => import('@/views/users/UserManagement.vue'),
        meta: {
          title: "Trang quản lý người dùng hệ thống",
        }
      },
      {
        path: 'create',
        name: 'UserCreate',
        component: () => import('@/views/users/UserCreate.vue'),
        meta: {
          title: "Trang thêm mới tài khoản hệ thống",
        }
      },
      {
        path: 'update',
        name: 'UserUpdate',
        component: () => import('@/views/users/UserUpdate.vue'),
        meta: {
          title: "Trang Cập nhật tài khoản hệ thống",
        }
      },
    ],
    meta: {
      requiresAuth: true,
    }
  }
]