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
            <a-form-item label="标签" name="label">
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
            <a-button type="link" class="action-btn" @click="handleView({ id: record.id })"
              >查看
            </a-button>
            <a-button type="link" class="action-btn" @click="handleRemove">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <view-correction-dialog
    v-if="viewState.visible"
    :id="viewState.id"
    @cancel="handleCancelViewDialog"
  />
</template>

<script lang="ts">
export default {
  name: 'CorrectionList',
};
</script>

<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList } from '@/services/goods';
import { FormStateType } from '@/types/myKnowledge/knowledge';
import ViewCorrectionDialog from './sections/ViewCorrectionDialog.vue';

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
      title: '纠错时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'create_time' && sorted.order,
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

// 获取数据
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
});

const viewState = reactive({
  visible: false,
  id: '1',
});

const handleView = (record: { id: string }) => {
  viewState.visible = true;
  viewState.id = record.id;
};

const handleCancelViewDialog = () => {
  viewState.visible = false;
};

const handleRemove = (record: { id: string }) => {
  message.success('删除成功');
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
