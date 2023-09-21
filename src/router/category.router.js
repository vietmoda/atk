/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/category',
    children: [
      {
        path: '',
        name: 'Category',
        component: () => import('@/views/category/CategoryManager.vue'),
        meta: {
          title:"Trang quản lý loại danh mục",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]