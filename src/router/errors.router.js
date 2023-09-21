export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/commons/Error'),
    meta: {
      layout: 'blank',
      title: "Trang không tồn tại 404"
    },
  }
]