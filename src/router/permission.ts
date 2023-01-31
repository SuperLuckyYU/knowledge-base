import router from './index';
// import Cookies from 'js-cookie';
import { useUserStore } from '@/store/moudles/user';
import { otherRoutes } from './index';

export default function createPermissionGuard() {
  /*判断是否主系统进入(1.是否被iframe包裹 2.获取参数token)
   * 是 更新路由*/
  router.beforeEach(async (to, from, next) => {
    console.log(
      '🚀 ~ file: permission.ts ~ line 10 ~ router.beforeEach ~ to ~ token',
      to.query.token,
    );
    // const token = Cookies.get('token');
    const token = localStorage.getItem('token');
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
      // Cookies.set('token', to.query.token as string, { expires: 1 });
      localStorage.setItem('token', to.query.token as string)
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
