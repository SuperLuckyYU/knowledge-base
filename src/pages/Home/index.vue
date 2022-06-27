<template>
  <div>
    <a-card class="search-box mt15">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="标题" name="knowledgeName">
              <a-input
                v-model:value.trim="formState.knowledgeName"
                placeholder="请输入标题"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="作者" name="creator">
              <a-input
                v-model:value.trim="formState.creator"
                placeholder="请输入作者"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="标签" name="labelId">
              <search-label-select v-model:value="formState.labelId" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="项目" name="itemId">
              <!-- <a-cascader
                style="min-width: 250px"
                v-model:value="formState.itemId"
                :options="projectOptions"
                placeholder="请选择项目"
                allow-clear
              /> -->
              <search-project-select v-model:value="formState.itemId" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="创建时间" name="dateRange">
              <a-range-picker
                v-model:value="formState.dateRange"
                :format="dateFormat"
                :value-format="dateFormat"
                allow-clear
                valueFormat="YYYY-MM-DD"
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
    <a-row>
      <a-col :span="6">
        <type-tree v-model:value="formState.knowledgeType" @change="handleKnowledgeTypeChange" />
      </a-col>
      <a-col :span="18">
        <a-card class="table-box mt20">
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
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
};
</script>

<script lang="ts" setup>
import type { FormStateType } from '@/types/home/index';
import { reactive, computed, UnwrapRef } from 'vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getKnowledgeList } from '@/services/home';
import TypeTree from './sections/TypeTree.vue';
import SearchLabelSelect from '@/components/SearchLabelSelect/index.vue';
import SearchProjectSelect from '@/components/SearchProjectSelect/index.vue';

const articleTypeOptions = reactive<
  {
    label: string;
    value: string;
  }[]
>([]);

const tagOptions = reactive([]);
const projectOptions = reactive([]);

const columns = computed(() => {
  const sorted = sortedInfo.value || {};

  return [
    {
      title: '知识条目',
      dataIndex: 'knowledgeName',
      key: 'knowledgeName',
      align: 'center',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'knowledgeFlag',
      key: 'knowledgeFlag',
      align: 'center',
    },
    {
      title: '分类',
      dataIndex: 'knowledgeType',
      key: 'knowledgeType',
      align: 'center',
    },
    {
      title: '安全级别',
      dataIndex: 'securityLevel',
      key: 'securityLevel',
      align: 'center',
    },
    {
      title: '有效期',
      dataIndex: 'deadline',
      key: 'deadline',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'deadline' && sorted.order,
      width: 300,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'createTime' && sorted.order,
      width: 300,
    },
  ];
});

const dateFormat = 'YYYY-MM-DD';

const formState: UnwrapRef<FormStateType> = reactive({
  knowledgeType: '',
  knowledgeName: '',
  creator: '',
  labelId: '',
  itemId: '',
  dateRange: ['', ''],
});

// 获取列表数据
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
  fetchData: getKnowledgeList,
  formatParams() {
    const dateRange = formState.dateRange.join(',');
    const data: Record<string, any> = {
      ...formState,
      dateRange: dateRange === ',' ? '' : dateRange,
    };
    return data;
  },
});

const handleKnowledgeTypeChange = () => {
  onSearch();
};
</script>

<style lang="less" scoped>
.search-box {
  border: none;
}
</style>
