/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/item',
    children: [
      {
        path: '',
        name: 'Item',
        component: () => import('@/views/item/ItemManager.vue'),
        meta: {
          title:"Trang quản lý danh mục chi tiết",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]