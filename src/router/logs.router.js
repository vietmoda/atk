/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/logcommand',
    children: [
      {
        path: '',
        name: 'Logcommand',
        component: () => import('@/views/logcommands/LogCommandsManager.vue'),
        meta: {
          title:"Trang quản lý logs",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]