import router from './index';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/moudles/user';
import { otherRoutes } from './index';

export default function createPermissionGuard() {
  router.beforeEach(async (to, from, next) => {
    const token = Cookies.get('token');
    if (
      otherRoutes.some(({ path }) => {
        return to.path === path;
      })
    ) {
      return next();
    }
    if (!token && !to.query.token) {
      return next({ path: '/not-login' });
    }
    if (to.query.token) {
      Cookies.set('token', to.query.token as string, { expires: 1 });
    }
    if (!useUserStore().userInfo.pUserId) {
      await useUserStore().getUserLogged();
    }
    await useUserStore().getMenuAuth();
    return next();
  });
  // 详情页滚动条回到顶部
  router.afterEach((to, from) => {
    if (to.meta.isMenu === false) {
      window.scrollTo(0, 0);
    }
  });
}
