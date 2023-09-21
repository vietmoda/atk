/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
    {
        path: '/report',
        children: [
            {
                path: '',
                name: 'Report',
                component: () => import('@/views/report/FestivalManager.vue'),
                meta: {
                    title: "Trang quản lý báo cáo",
                }
            }
        ],
        meta: {
            requiresAuth: true,
        }
    }
]