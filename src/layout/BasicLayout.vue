<template>
  <a-layout class="layout-wrap">
    <template v-if="isShowMenu">
      <a-layout-header class="header-container">
        <!-- <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        /> -->
        <!-- <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" /> -->
        <router-link class="app-logo" to="/">
          <h1 class="title" v-if="!collapsed">{{ STATE.title }}</h1>
        </router-link>
        <user :name="STATE.name" :avatar="STATE.avatar" />
      </a-layout-header>
      <a-layout-sider class="sider-container" v-model:collapsed="collapsed">
        <!-- <router-link class="app-logo" to="/">
        <h1 class="title" v-if="!collapsed">{{ STATE.title }}</h1>
      </router-link> -->
        <a-menu
          :selectedKeys="STATE.selectedKeys"
          v-model:openKeys="STATE.openKeys"
          theme="dark"
          mode="inline"
          @select="handleSelectMenu"
        >
          <template v-for="route of routerList">
            <Menus :route="route" />
          </template>
        </a-menu>
      </a-layout-sider>
    </template>
    <a-layout :style="isShowMenu ? { marginLeft: '200px' } : ''">
      <!-- <a-layout-header class="header-container">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <user :name="STATE.name" :avatar="STATE.avatar" />
      </a-layout-header> -->
      <a-layout-content :id="isShowMenu ? 'content-container' : ''">
        <router-view v-slot="{ Component, route }" :key="route.fullPath">
          <keep-alive :include="cacheList">
            <component :is="Component" :key="route.meta.path" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute, RouteRecordName } from 'vue-router';
import { routes } from '@/router/index';
import appConfig from '../config/app.config';
import User from './User.vue';
import Menus from './Menus.vue';
import { useUserStore } from '@/store/moudles/user';
import { useKeepAliveStore } from '@/store/moudles/keepAlive';
import useReloadPage from '@/composables/useReloadPage';
useReloadPage();

type Key = string;

interface SelectEventHandler {
  key: Key;
  selectedKeys: Key[];
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const keepAliveStore = useKeepAliveStore();

const collapsed = ref<boolean>(false);

interface StateType {
  title: string;
  selectedKeys: (RouteRecordName | null | undefined)[];
  openKeys: string[];
  name: string;
  avatar: string;
}
const STATE = reactive<StateType>({
  title: appConfig.appName,
  selectedKeys: [''],
  openKeys: [],
  name: '',
  avatar: '',
});
// const routerList = routes;
// const routerList = router.options.routes;
const routerList = userStore.menuList;
const cacheList = computed(() => {
  // return getRouteList(routerList)
  //   .filter((item: { meta: { notCache: any } }) => !(item.meta && item.meta.notCache))
  //   .map((item: { name: any }) => item.name);
  return keepAliveStore.getCaches.join(',');
});

const isShowMenu = ref(false);

const handleSelectMenu = ({ key, selectedKeys }: SelectEventHandler) => {
  router.push({ name: key });
  STATE.selectedKeys = selectedKeys;
};

onMounted(async () => {
  let iframeBool = window.self === window.top; /*是否被iframe嵌套 false被嵌套  true否*/
  if (!iframeBool) {
    isShowMenu.value = false;
  } else {
    isShowMenu.value = true;
    STATE.selectedKeys = [route.name];
    STATE.openKeys = [route.path.split('/')[1]];
    const { userName, photo } = userStore.userInfo;
    STATE.name = userName;
    STATE.avatar = photo;
  }
});
</script>
<style lang="less" scoped>
@sibar-bg: #0d87e8;
@menu-color: #2785da;

.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  height: 64px;
  .title {
    color: #2785da;
    font-size: 20px;
  }
}

.logo {
  width: 30px;
  height: 30px;
}

.ant-layout-sider {
  background: @sibar-bg;
}

.ant-menu.ant-menu-dark {
  background: @sibar-bg;
}

.ant-menu {
  padding-top: 20px;
  padding: 80px 10px 0 10px;
}

:deep(.ant-menu-dark .ant-menu-inline.ant-menu-sub) {
  background: @sibar-bg;
}

:deep(.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected) {
  background-color: #fff;
  border-radius: 4px;
}

:deep(.ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon + span, .ant-menu-dark
    .ant-menu-item-selected
    .anticon
    + span) {
  color: @menu-color;
}

:deep(.ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon, .ant-menu-dark
    .ant-menu-item-selected
    .anticon) {
  color: @menu-color;
}

:deep(.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected) {
  color: @menu-color;
}

.title {
  display: inline-block;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 0;
}

.trigger {
  font-size: 18px;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
