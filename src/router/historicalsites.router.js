/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
    {
        path: '/historicalsites',
        children: [
            {
                path: '',
                name: 'HistoricalSites',
                component: () => import('@/views/historicalsites/HistoricalSitesManager.vue'),
                meta: {
                    title: "Trang quản lý di tích lịch sử",
                }
            }
        ],
        meta: {
            requiresAuth: true,
        }
    }
]