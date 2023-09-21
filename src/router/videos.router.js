/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/videos',
    children: [
      {
        path: '',
        name: 'Video',
        component: () => import('@/views/videos/VideoManager.vue'),
        meta: {
          title:"Trang quản lý Video",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]