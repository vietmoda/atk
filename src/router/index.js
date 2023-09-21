// Composables
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import errorRouter from '@/router/errors.router';
import authRouter from '@/router/auth.router';
import bookingsRouter from '@/router/bookings.router';
import usersRouter from '@/router/users.router';
import newsCategoriesRouter from '@/router/newscategories.router';
import categoryRouter from '@/router/category.router';
import itemRouter from '@/router/item.router';
import videosRouter from '@/router/videos.router';
import albumsRouter from '@/router/albums.router';
import webLinksRouter from '@/router/weblinks.router';
import newsRouter from '@/router/news.router';
import orderMenusRouter from '@/router/ordermenus.router';
import suggestedMenusRouter from '@/router/suggestedmenus.router';
import systemConfigsRouter from '@/router/systemconfigs.router';
import logsRouter from '@/router/logs.router';
import historicalsitesRouter from '@/router/historicalsites.router';
import festivalsRouter from '@/router/festival.router';
import clientUserRouter from '@/router/clientusers.router';
import artifactsRouter from '@/router/artifacts.router';
import servicesRouter from '@/router/services.router';
import restoreRouter from '@/router/restore.router';
import reportRouter from '@/router/report.router';

const routes = [
  ...errorRouter,
  ...authRouter,
  ...bookingsRouter,
  ...newsRouter,
  ...usersRouter,
  ...newsCategoriesRouter,
  ...categoryRouter,
  ...itemRouter,
  ...videosRouter,
  ...albumsRouter,
  ...webLinksRouter,
  ...orderMenusRouter,
  ...suggestedMenusRouter,
  ...systemConfigsRouter,
  ...logsRouter,
  ...historicalsitesRouter,
  ...festivalsRouter,
  ...clientUserRouter,
  ...artifactsRouter,
  ...servicesRouter,
  ...restoreRouter,
  ...restoreRouter,
  ...reportRouter,
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      requiresAuth: true,
      title: "Trang quản trị"
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/grouprole",
    name: "GroupRole",
    component: () => import('@/views/grouprole/GroupRoleManager.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: 'error-404',
  }

]

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  nextTick(() => {
    document.title = to.meta.title ? `${to.meta.title}` : 'Hệ thống quản lý di tích ATK';
  });
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("accessToken") == null) {
      return next({
        path: "/auth/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      return next();
    }
  }
  return next();
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router
