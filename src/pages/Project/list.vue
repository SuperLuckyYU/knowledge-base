<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="项目名称" name="name">
              <a-input
                v-model:value.trim="formState.name"
                placeholder="请输入项目名称"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="onSearch">查询</a-button>
                <a-button @click="onReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card>
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
      </a-table>
    </a-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProductList',
};
</script>
<script lang="ts" setup>
import type { FormStateType } from '@/types/systemSetter/product';
import { reactive, UnwrapRef } from 'vue';
import { getProductList } from '@/services/goods';
import useSearchTableList from '@/composables/useSearchTableList';

const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '负责科室',
    dataIndex: 'department',
    key: 'department',
    align: 'center',
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal',
    align: 'center',
  },
  {
    title: '项目组成员',
    dataIndex: 'members',
    key: 'members',
    align: 'center',
  },
  {
    title: '项目组周期',
    dataIndex: 'cycle',
    key: 'cycle',
    align: 'center',
  },
];

const formState: UnwrapRef<FormStateType> = reactive({
  name: '',
});

// 获取数据
const { onSearch, onReset, pagination, dataSource, searchFormRef, onTableChange, getList } =
  useSearchTableList({
    fetchData: getProductList,
    formatParams() {
      const data: Record<string, any> = { ...formState };
      return data;
    },
    listFormatEnum: true,
  });
</script>

<style lang="less" scoped></style>
