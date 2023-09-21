/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
    {
        path: '/services',
        children: [
            {
                path: '',
                name: 'Services',
                component: () => import('@/views/service/FestivalManager.vue'),
                meta: {
                    title: "Trang quản lý dịch vụ",
                }
            }
        ],
        meta: {
            requiresAuth: true,
        }
    }
]