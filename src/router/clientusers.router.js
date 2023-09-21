/**
 * Router các pages quản lý người dùng, quản lý tài khoản...
 * @author VNPT Thái Nguyên
 */
export default [
    {
        path: '/clientusers',
        children: [
            {
                path: '',
                name: 'ClientUsers',
                component: () => import('@/views/clientusers/UserManagement.vue'),
                meta: {
                    title: "Trang quản lý người dùng khách hàng",
                }
            },
            {
                path: 'create',
                name: 'UserCreate',
                component: () => import('@/views/clientusers/UserCreate.vue'),
                meta: {
                    title: "Trang thêm mới tài khoản khách hàng",
                }
            },
            {
                path: 'update',
                name: 'UserUpdate',
                component: () => import('@/views/clientusers/UserUpdate.vue'),
                meta: {
                    title: "Trang Cập nhật tài khoản khách hàng",
                }
            },
        ],
        meta: {
            requiresAuth: true,
        }
    }
]