/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
    {
        path: '/artifacts',
        children: [
            {
                path: '',
                name: 'Artifacts',
                component: () => import('@/views/artifact/FestivalManager.vue'),
                meta: {
                    title: "Trang quản lý hiện vật",
                }
            }
        ],
        meta: {
            requiresAuth: true,
        }
    }
]