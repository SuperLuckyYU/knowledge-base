<template>
  <div>
    <a-row>
      <a-col :span="16">
        <a-card class="map-container mt20">
          <Map />
        </a-card>
      </a-col>
      <a-col :span="7">
        <a-card>
          <div class="title mb15">热门排行榜</div>
          <a-table :columns="columns" :data-source="[]" bordered>
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'knowledgeName'">
                <router-link :to="{ name: 'ArticleDetail', query: { id: record.id } }">{{
                  text
                }}</router-link>
              </template>
            </template>
          </a-table>
          <div class="title mt15">实时热搜</div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
export default {
  name: 'KnowledgeMap',
};
</script>
<script lang="ts" setup>
import Map from './sections/map.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'version',
    width: 80,
  },
  {
    title: '条目',
    dataIndex: 'knowledgeName',
    align: 'center',
  },
];
</script>

<style lang="less" scoped>
.map-container {
  height: 100%;
}
.title {
  font-weight: bold;
  font-size: 20px;
}
</style>
