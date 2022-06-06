<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="条目标题" name="name">
              <a-input
                v-model:value.trim="formState.name"
                placeholder="请输入条目标题"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="标签" name="name">
              <a-select
                v-model:value="formState.label"
                :options="labelOptions"
                mode="tags"
                placeholder="请选择标签"
                style="width: 200px"
              ></a-select>
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
    <a-card class="table-box mt20">
      <a-row class="action-btn-box">
        <a-button class="mr15" type="primary" @click="handleOperateKnowledge({ id: '' }, 'create')"
          >新建知识</a-button
        >
        <a-button class="mr15">批量上传文档</a-button>
        <a-button>新建专题</a-button>
      </a-row>
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn">分享</a-button>
            <a-button type="link" class="action-btn">编辑</a-button>
            <a-button type="link" class="action-btn">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'KnowledgeList',
};
</script>

<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList } from '@/services/goods';
import { FormStateType } from '@/types/myKnowledge/knowledge';

const router = useRouter();

const labelOptions = reactive([]);

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '知识条目',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '分类',
      dataIndex: 'categoyr',
      key: 'categoyr',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'create_time' && sorted.order,
    },
    {
      title: '最后编辑时间',
      dataIndex: 'last_update_time',
      key: 'last_update_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'last_update_time' && sorted.order,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const formState: UnwrapRef<FormStateType> = reactive({
  name: '',
  label: [],
});

// // 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  searchFormRef,
  onTableChange,
  sortedInfo,
} = useSearchTableList({
  fetchData: getProductList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    return data;
  },
  listFormatEnum: true,
});

const handleOperateKnowledge = (record: { id: string }, type: 'create' | 'update') => {
  router.push({
    name: 'KnowledgeCreate',
    query: record.id
      ? {
          id: record.id,
          type: type,
        }
      : {
          type: type,
        },
  });
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>