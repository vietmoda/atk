/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/images',
    children: [
      {
        path: '',
        name: 'album',
        component: () => import('@/views/albums/ImageManager.vue'),
        meta: {
          title:"Trang quản lý ảnh",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]