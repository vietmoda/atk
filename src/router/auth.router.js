/**
 * Router dành cho các page liên quan tới xác thực như login, logout, signup...
 * @author VNPT Thái Nguyên
 */
export default [
  {
    path: '/auth',
    children:[
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
          title:"Trang đăng nhập"
        }
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/views/auth/SignUp.vue'),
        meta: {
          title:"Trang đăng ký"
        }
      }
    ],
    meta: {
      layout: 'blank',
    },
  }
]