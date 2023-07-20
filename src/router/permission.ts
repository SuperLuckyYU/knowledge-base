import router from './index';
// import Cookies from 'js-cookie';
import { useUserStore } from '@/store/moudles/user';
import { otherRoutes } from './index';
import { decrypt } from '@/utils/AesUtils.js';

export default function createPermissionGuard() {
  /*判断是否主系统进入(1.是否被iframe包裹 2.获取参数token)
   * 是 更新路由*/
  router.beforeEach(async (to, from, next) => {
    // const token = Cookies.get('token');

    const token = localStorage.getItem('token');
    if (
      otherRoutes.some(({ path }) => {
        return to.path === path;
      })
    ) {
      return next();
    }
    if (!token && !to.query.thirdParams) {
      return next({ path: '/not-login' });
    }

    if (to.query.thirdParams) {
      type ThirdParams = {
        randomCode: string;
        thirdUserId: string;
        timeStamp: string;
      };
      const thirdParams: ThirdParams = JSON.parse(
        decodeURIComponent(window.location.href.split('=')[1]),
      );
      const { thirdUserId, randomCode, timeStamp } = thirdParams;
      const uid = decrypt(thirdUserId, 'oR2Yx6GZbP7S8' + timeStamp + randomCode);
      localStorage.setItem('token', uid);
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
