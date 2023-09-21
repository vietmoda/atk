/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/newscategories',
    children: [
      {
        path: '',
        name: 'NewsCategories',
        component: () => import('@/views/newscategories/NewCategoriesManager.vue'),
        meta: {
          title:"Trang quản lý chuyên mục",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]