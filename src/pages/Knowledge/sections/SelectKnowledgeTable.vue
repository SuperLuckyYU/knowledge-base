<template>
  <a-table :columns="columns" v-bind="$attrs">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'">
        <slot name="operation" :record="record"></slot>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
const columns = [
  {
    title: '条目标题',
    dataIndex: 'knowledgeName',
    key: 'knowledgeName',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 110,
  },
];
</script>
