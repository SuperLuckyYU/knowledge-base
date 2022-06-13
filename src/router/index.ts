import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import BasicLayout from '@/layout/BasicLayout.vue';
import Home from '@/pages/Home/index.vue';
import GoodsList from '@/pages/GoodsManager/index.vue';
import GoodsCreate from '@/pages/GoodsManager/create/index.vue';
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

//静态路由页面
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BasicLayout,
    meta: { title: '知识首页', icon: 'HomeOutlined', level: '1', key: 'home' },
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
    ],
  },
  {
    path: '/goodsManage',
    name: 'goodsManage',
    component: BasicLayout,
    meta: { title: '商品管理', icon: 'SkinOutlined' },
    children: [
      {
        path: 'list',
        name: 'GoodsList',
        meta: {
          title: '商品列表',
          keepAlive: true,
        },
        component: GoodsList,
      },
      {
        path: 'create',
        name: 'GoodsCreate',
        meta: {
          title: '创建商品',
          isMenu: false,
          keepAlive: false,
        },
        component: GoodsCreate,
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
        path: 'create',
        name: 'KnowledgeCreateTopic',
        meta: {
          title: '创建标题',
          isMenu: false,
          keepAlive: false,
        },
        component: KnowledgeCreateTopic,
      },
      {
        path: 'articleDetail',
        name: 'ArticleDetail',
        meta: { title: '详情', isMenu: false },
        component: ArticleDetail,
      },
      {
        path: 'collection',
        name: 'CollectionList',
        meta: {
          title: '我的收藏',
          keepAlive: true,
        },
        component: CollectionList,
      },
      {
        path: 'correction',
        name: 'CorrectionList',
        meta: {
          title: '我的纠错',
          keepAlive: true,
        },
        component: CorrectionList,
      },
      {
        path: 'audit',
        name: 'AuditList',
        meta: {
          title: '知识审核',
          keepAlive: true,
        },
        component: AuditList,
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
        },
        component: UserList,
      },
      {
        path: 'role',
        name: 'RoleList',
        meta: {
          title: '角色与权限',
          keepAlive: true,
        },
        component: RoleList,
      },
      {
        path: 'product',
        name: 'ProductList',
        meta: {
          title: '项目列表',
          keepAlive: true,
        },
        component: ProductList,
      },
      {
        path: 'label',
        name: 'LabelList',
        meta: {
          title: '知识标签管理',
          keepAlive: true,
        },
        component: LabelList,
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        meta: {
          title: '数据字典',
          keepAlive: false,
        },
        component: Dictionary,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory
  routes,
});

export default router;
