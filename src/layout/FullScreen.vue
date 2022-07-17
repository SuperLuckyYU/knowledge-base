<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FullScreenLayout',
};
</script>
