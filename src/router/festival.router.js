/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
    {
        path: '/festivals',
        children: [
            {
                path: '',
                name: 'Festivals',
                component: () => import('@/views/festival/FestivalManager.vue'),
                meta: {
                    title: "Trang quản lý lễ hội",
                }
            }
        ],
        meta: {
            requiresAuth: true,
        }
    }
]