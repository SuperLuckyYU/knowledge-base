import type { RouteRecordRaw } from 'vue-router';
import type { MenuReturnProps } from '@/services/systemSetter/role';
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { fetchMenuAuth, fetchCurrentUser } from '@/services/user';
import router, { routes, otherRoutes } from '@/router/index';
import { cloneDeep } from 'lodash-es';

type StateType = {
  userInfo: {
    id: string;
    userName: string;
    sex: 1 | 2;
    moblie: string;
    pUserId: string;
    photo: string;
  };
  authList: string[];
  menuList: RouteRecordRaw[];
  menuOperateAuthMap: Record<string, any>;
};

const defaultUserInfo = {
  userName: '',
  sex: 1,
  moblie: '',
  pUserId: '',
  photo: '',
  id: '',
};

const userInfo = Cookies.get('userInfo')
  ? JSON.parse(Cookies.get('userInfo') as string)
  : defaultUserInfo;

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): StateType => ({
    // user info
    userInfo,
    // 权限列表
    authList: [],
    menuList: [],
    menuOperateAuthMap: {},
  }),
  getters: {},
  actions: {
    // getUser
    async getUserLogged() {
      try {
        const res = await fetchCurrentUser({ token: Cookies.get('token') ?? '' });
        this.userInfo = res;
        Cookies.set('userInfo', JSON.stringify(res));
      } catch (error) {
        return false;
      }
    },

    // 获取潘多拉权限
    async getMenuAuth() {
      try {
        const data = await fetchMenuAuth();
        const newRoutes: RouteRecordRaw[] = [];
        const menuOperateAuthMap: Record<string, any> = {};
        const recursion = (
          _routes: RouteRecordRaw[],
          _data: MenuReturnProps,
          target: any[],
          defaultFirstLevel: boolean = false,
        ) => {
          for (let i = 0; i < _routes.length; i++) {
            const route = _routes[i];
            for (let j = 0; j < _data.length; j++) {
              const menu = _data[j];
              if (menu.menuName === route.meta?.title) {
                if (menu.children && menu.children.length > 0) {
                  if (route.meta?.level === '1' || defaultFirstLevel) {
                    const hasReadAuth =
                      menu.children.filter((item) => {
                        return item.menuName === '仅查看' || item.menuName === '可编辑';
                      }).length > 0;
                    const hasOperateAuth =
                      menu.children.filter((item) => {
                        return item.menuName === '可编辑';
                      }).length > 0;
                    const newRoute = cloneDeep(route);
                    menuOperateAuthMap[route.meta.key as any] = hasOperateAuth;
                    this.menuOperateAuthMap = menuOperateAuthMap;
                    if (hasReadAuth) target.push(newRoute);
                  } else {
                    target.push(cloneDeep(route));
                    target[i].children = [];
                    recursion(route.children ?? [], menu.children, target[i].children, true);
                  }
                }
              }
            }
          }
        };
        recursion(routes, data, newRoutes);
        router.options.routes = [...newRoutes, ...otherRoutes];
        this.menuList = newRoutes;
      } catch (error) {
        return false;
      }
    },

    redirectToLogin() {
      const loginUrl = '//pandora.yidian-inc.com/tools/admin/login';
      const cbUrl = location.href;
      location.href = `${loginUrl}?callback=${cbUrl}`;
    },
  },
});
