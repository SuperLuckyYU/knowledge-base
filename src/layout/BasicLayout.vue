<template>
  <a-layout class="layout-wrap">
    <a-layout-sider
      class="sider-container"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
    >
      <router-link class="app-logo" to="/">
        <h1 class="title" v-if="!collapsed">{{ STATE.title }}</h1>
      </router-link>
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
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header class="header-container">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <user :name="STATE.name" :avatar="STATE.avatar" :emailAddr="STATE.emailAddr" />
      </a-layout-header>
      <a-layout-content id="content-container">
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
  emailAddr: string;
}
const STATE = reactive<StateType>({
  title: appConfig.appName,
  selectedKeys: [''],
  openKeys: [],
  name: '',
  avatar: '',
  emailAddr: '',
});
const routerList = router.options.routes;
const cacheList = computed(() => {
  // return getRouteList(routerList)
  //   .filter((item: { meta: { notCache: any } }) => !(item.meta && item.meta.notCache))
  //   .map((item: { name: any }) => item.name);
  return keepAliveStore.getCaches.join(',');
});

const handleSelectMenu = ({ key, selectedKeys }: SelectEventHandler) => {
  router.push({ name: key });
  STATE.selectedKeys = selectedKeys;
};

onMounted(async () => {
  STATE.selectedKeys = [route.name];
  STATE.openKeys = [route.path.split('/')[1]];
  const { name, avatar, email } = userStore.userInfo;
  STATE.name = name;
  STATE.avatar = avatar;
  STATE.emailAddr = email;
});
</script>
<style lang="less" scoped>
.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001529;
  height: 64px;
}

.logo {
  width: 30px;
  height: 30px;
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
