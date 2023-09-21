/**
 * Router các pages quản lý tham số hệ thống
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/systemconfigs',
    children: [
      {
        path: '',
        name: 'SystemConfigs',
        component: () => import('@/views/systemconfigs/SystemConfigManager.vue'),
        meta: {
          title:"Trang quản lý tham số hệ thống",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]