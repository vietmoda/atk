/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/suggestedmenus',
    children: [
      {
        path: '',
        name: 'SuggestedMenus',
        component: () => import('@/views/suggestedmenus/SuggestedMenuManager.vue'),
        meta: {
          title:"Trang quản lý thực đơn",
        }
      }
    ],
    meta: {
      requiresAuth: true,
    }
  }
]