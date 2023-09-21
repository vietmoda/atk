/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/news',
    children: [
      {
        path: '',
        name: 'News',
        component: () => import('@/views/news/NewsManager.vue'),
        meta: {
          title:"Trang quản lý bài viết",
        }
      },
      {
        path: 'create',
        name: 'NewsCreate',
        component: () => import('@/views/news/NewsCreate.vue'),
        meta: {
          title:"Trang thêm mới bài viết",
        }
      },
      {
        path: 'update',
        name: 'NewsUpdate',
        component: () => import('@/views/news/NewsUpdate.vue'),
        meta: {
          title:"Trang Cập nhật bài viết",
        }
      },
    ],
    meta: {
      requiresAuth: true,
    }
  }
]