import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layout/BasicLayout.vue';
import Home from '@/pages/Home/index.vue';
import GoodsList from '@/pages/GoodsManager/index.vue';
import GoodsCreate from '@/pages/GoodsManager/create/index.vue';
import OrderList from '@/pages/OrderManager/index.vue';
import OrderDetail from '@/pages/OrderManager/detail.vue';
import InWarehouseManage from '@/pages/InventoryManager/in.vue';
import OutWarehouseManage from '@/pages/InventoryManager/out.vue';
import DefectManage from '@/pages/InventoryManager/defect.vue';
import OutWarehouseDetail from '@/pages/InventoryManager/outDetail.vue';
import MatchSuitList from '@/pages/MatchSuit/index.vue';
import SuitCreate from '@/pages/MatchSuit/create/index.vue';

//静态路由页面
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        meta: { title: '首页', isMenu: false },
        component: Home
      }
    ]
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
          keepAlive: true
        },
        component: GoodsList,
      }, {
        path: 'create',
        name: 'GoodsCreate',
        meta: {
          title: '创建商品',
          isMenu: false,
          keepAlive: false
        },
        component: GoodsCreate,
      },
    ]
  },
  {
    path: '/inventoryrManage',
    name: 'inventoryrManage',
    component: BasicLayout,
    meta: { title: '库存管理', icon: 'ShoppingCartOutlined' },
    children: [
      {
        path: 'in',
        name: 'InWarehouseManage',
        meta: {
          title: '入库管理',
          keepAlive: true
        },
        component: InWarehouseManage,
      },
      {
        path: 'out',
        name: 'OutWarehouseManage',
        meta: {
          title: '出库管理',
          keepAlive: true,
        },
        component: OutWarehouseManage,
      },
      {
        path: 'defect',
        name: 'DefectManage',
        meta: {
          title: '次品管理',
          keepAlive: true,
        },
        component: DefectManage,
      },
      {
        path: 'outDetail',
        name: 'OutWarehouseDetail',
        meta: {
          title: '售后出库',
          keepAlive: false,
          isMenu: false
        },
        component: OutWarehouseDetail,
      }
    ]
  },
  {
    path: '/MatchSuit',
    name: 'matchSuit',
    component: BasicLayout,
    meta: { title: '套装搭配', icon: 'GiftOutlined' },
    children: [
      {
        path: 'list',
        name: 'MatchSuitList',
        meta: {
          title: '搭配列表',
          keepAlive: true
        },
        component: MatchSuitList,
      }, {
        path: 'create',
        name: 'SuitCreate',
        meta: {
          title: '创建套装',
          isMenu: false,
          keepAlive: false
        },
        component: SuitCreate,
      },
    ]
  },
  {
    path: '/orderManage',
    name: 'orderManage',
    component: BasicLayout,
    meta: { title: '订单管理', icon: 'CreditCardOutlined' },
    children: [
      {
        path: '/orderManage/list',
        name: 'OrderList',
        meta: {
          title: '订单列表',
          keepAlive: true,
        },
        component: OrderList,
      },
      {
        path: '/orderManage/deatil',
        name: 'OrderDetail',
        meta: {
          title: '订单详情',
          keepAlive: false,
          isMenu: false
        },
        component: OrderDetail,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory
  routes
})

export default router
