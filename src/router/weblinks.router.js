/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/weblinks',
    children: [
      {
        path: '',
        name: 'Weblinks',
        component: () => import('@/views/weblinks/WebLinkManager.vue'),
        meta: {
          title:"Trang quản lý weblink",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]