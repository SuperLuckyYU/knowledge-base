import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import BasicLayout from '@/layout/BasicLayout.vue';
import FullScreen from '@/layout/FullScreen.vue';
import NotLogin from '@/pages/Auth/notLogin.vue';
import Home from '@/pages/Home/index.vue';
import KnowledgeList from '@/pages/Knowledge/list.vue';
import KnowledgeCreate from '@/pages/Knowledge/create/index.vue';
import KnowledgeCreateTopic from '@/pages/Knowledge/create/topic.vue';
import ArticleDetail from '@/pages/ArticleDetail/index.vue';
import UserList from '@/pages/User/list.vue';
import RoleList from '@/pages/Role/list.vue';
import ProductList from '@/pages/Project/list.vue';
import LabelList from '@/pages/Label/list.vue';
import Dictionary from '@/pages/Dictionary/index.vue';
import CollectionList from '@/pages/MyCollection/list.vue';
import CorrectionList from '@/pages/MyErrorCorrection/list.vue';
import AuditList from '@/pages/Audit/list.vue';
import KnowledgeMap from '@/pages/KnowledgeMap/index.vue';
import Statistical from '@/pages/Statistical/index.vue';

//静态路由页面
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BasicLayout,
    meta: { title: '知识首页', icon: 'HomeOutlined', level: '1', key: 'Home' },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
    ],
  },
  {
    path: '/knowledgeMap',
    component: BasicLayout,
    meta: { title: '知识地图', icon: 'DashboardOutlined', level: '1', key: 'KnowledgeMap' },
    children: [
      {
        path: '',
        name: 'KnowledgeMap',
        component: KnowledgeMap,
      },
    ],
  },
  {
    path: '/myKnowledge',
    name: 'myKnowledge',
    component: BasicLayout,
    meta: { title: '我的知识', icon: 'BookOutlined' },
    children: [
      {
        path: 'knowledge',
        name: 'KnowledgeList',
        meta: {
          title: '我的知识',
          keepAlive: true,
          key: 'KnowledgeList',
        },
        component: KnowledgeList,
      },
      {
        path: 'create',
        name: 'KnowledgeCreate',
        meta: {
          title: '创建知识',
          isMenu: false,
          keepAlive: false,
        },
        component: KnowledgeCreate,
      },
      {
        path: 'create-topic',
        name: 'KnowledgeCreateTopic',
        meta: {
          title: '创建标题',
          isMenu: false,
          keepAlive: false,
        },
        component: KnowledgeCreateTopic,
      },
      {
        path: 'article-detail',
        name: 'ArticleDetail',
        meta: { title: '详情', isMenu: false, keepAlive: false },
        component: ArticleDetail,
      },
      {
        path: 'collection',
        name: 'CollectionList',
        meta: {
          title: '我的收藏',
          keepAlive: true,
          key: 'CollectionList',
        },
        component: CollectionList,
      },
      {
        path: 'correction',
        name: 'CorrectionList',
        meta: {
          title: '我的纠错',
          keepAlive: true,
          key: 'CorrectionList',
        },
        component: CorrectionList,
      },
      {
        path: 'audit',
        name: 'AuditList',
        meta: {
          title: '知识审核',
          keepAlive: true,
          key: 'AuditList',
        },
        component: AuditList,
      },
    ],
  },
  {
    path: '/statistical',
    component: BasicLayout,
    meta: { title: '统计报表', icon: 'BarChartOutlined', level: '1', key: 'statistical' },
    children: [
      {
        path: '',
        name: 'Statistical',
        component: Statistical,
      },
    ],
  },
  {
    path: '/systemSetter',
    name: 'systemSetter',
    component: BasicLayout,
    meta: { title: '系统管理', icon: 'SettingOutlined' },
    children: [
      {
        path: 'user',
        name: 'UserList',
        meta: {
          title: '用户管理',
          keepAlive: true,
          key: 'UserList',
        },
        component: UserList,
      },
      {
        path: 'role',
        name: 'RoleList',
        meta: {
          title: '角色与权限',
          keepAlive: true,
          key: 'RoleList',
        },
        component: RoleList,
      },
      // {
      //   path: 'product',
      //   name: 'ProductList',
      //   meta: {
      //     title: '项目列表',
      //     keepAlive: true,
      //   },
      //   component: ProductList,
      // },
      {
        path: 'label',
        name: 'LabelList',
        meta: {
          title: '知识标签管理',
          keepAlive: true,
          key: 'LabelList',
        },
        component: LabelList,
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        meta: {
          title: '数据字典',
          keepAlive: false,
          key: 'Dictionary',
        },
        component: Dictionary,
      },
    ],
  },
];

export const otherRoutes: Array<RouteRecordRaw> = [
  {
    path: '/not-login',
    meta: {
      isMenu: false,
    },
    component: FullScreen,
    children: [
      {
        path: '',
        component: NotLogin,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory
  routes: [...routes, ...otherRoutes],
  // routes: [],
});

export default router;
