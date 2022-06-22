<template>
  <div>
    <a-card class="search-box-wrap mt15">
      <a-tabs
        v-model:activeKey="formState.type"
        type="card"
        :tabBarGutter="6"
        class="search-tabs"
        @change="handelTypeChange"
      >
        <a-tab-pane
          v-for="item in articleTypeOptions"
          :key="item.value"
          :tab="item.label"
        ></a-tab-pane>
      </a-tabs>
      <a-card class="search-box">
        <a-form ref="searchFormRef" layout="inline" :model="formState">
          <a-row :gutter="[24, 16]">
            <a-col>
              <a-form-item label="标题" name="title">
                <a-input
                  v-model:value.trim="formState.title"
                  placeholder="请输入标题"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="作者" name="author">
                <a-input
                  v-model:value.trim="formState.author"
                  placeholder="请输入作者"
                  autocomplete="off"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="标签" name="tag">
                <a-cascader
                  style="min-width: 250px"
                  v-model:value="formState.tag"
                  :options="tagOptions"
                  placeholder="请选择标签"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="项目" name="project">
                <a-cascader
                  style="min-width: 250px"
                  v-model:value="formState.project"
                  :options="projectOptions"
                  placeholder="请选择项目"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="创建时间" name="createTime">
                <a-range-picker
                  v-model:value="formState.createTime"
                  :format="dateFormat"
                  :value-format="dateFormat"
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
      </a-table>
    </a-card>
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

const articleTypeOptions = reactive([
  {
    label: '法律法规',
    value: '0',
  },
  {
    label: '水务基础',
    value: '1',
  },
]);

const tagOptions = reactive([]);
const projectOptions = reactive([]);

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
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    },
    {
      title: '安全级别',
      dataIndex: 'safeLevel',
      key: 'safeLevel',
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
  type: '0',
  title: '',
  author: '',
  tag: '',
  project: '',
  createTime: ['', ''],
});

const handelTypeChange = (val: string) => {
  formState.type = val;
  onReset();
};

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
    const data: Record<string, any> = { ...formState };
    return data;
  },
});
</script>

<style lang="less" scoped>
.search-box {
  border: none;
  margin-bottom: 0;
}

.search-box-wrap {
  .ant-card-body {
    padding: 15px;
  }
}

.search-tabs {
  border: none;

  .ant-tabs-nav {
    margin: 0 !important;
  }

  .ant-tabs-top > .ant-tabs-nav::before {
    border-color: #ffffff;
  }
}
</style>
