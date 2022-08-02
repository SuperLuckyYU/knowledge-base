<template>
  <!-- 如果存在子路由 -->
  <template v-if="route?.children && route?.meta?.level !== '1' && !(route.meta?.isMenu === false)">
    <a-sub-menu :key="route.name" :title="route.meta?.title || '未命名'">
      <template #icon>
        <component :is="route.meta?.icon"></component>
      </template>
      <template v-for="children of route.children">
        <template v-if="!(children.meta?.isMenu === false)">
          <!-- 递归 -->
          <Menus :route="children" />
        </template>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="key" v-if="!(route?.meta?.isMenu === false)">
      <template #icon>
        <component :is="route?.meta?.icon"></component>
      </template>
      <span class="nav-text"> {{ route?.meta?.title || '未命名' }} </span>
    </a-menu-item>
  </template>
</template>
<script lang="ts">
import { toRefs, defineComponent, PropType, computed } from 'vue';
import {
  SkinFilled,
  SettingFilled,
  BookFilled,
  HomeFilled,
  DashboardFilled,
  PieChartFilled,
} from '@ant-design/icons-vue';
import { RouteRecordRaw } from 'vue-router';

interface RouteMenusProps {
  route: RouteRecordRaw;
}
export default defineComponent({
  components: {
    SkinFilled,
    SettingFilled,
    BookFilled,
    HomeFilled,
    DashboardFilled,
    PieChartFilled,
  },
  props: {
    route: {
      type: Object as PropType<RouteRecordRaw>,
      value: {},
    },
  },

  setup(props) {
    // 暴露给模板和 API 钩子的其他选项
    const { route } = toRefs(props);
    const key = computed(() => {
      if (route.value?.meta?.level === '1') {
        return route.value?.meta?.key;
      }
      return route.value?.name;
    });
    return {
      ...toRefs(props),
      key,
    };
  },
});
</script>
