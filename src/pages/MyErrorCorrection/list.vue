<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="条目标题" name="knowledgeName">
              <a-input
                v-model:value.trim="formState.knowledgeName"
                placeholder="请输入条目标题"
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
          <template v-if="column.dataIndex === 'knowledgeName'">
            <router-link :to="{ name: 'ArticleDetail', query: { id: record.id } }">{{
              text
            }}</router-link>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleView({ id: record.id })"
              >查看
            </a-button>
            <a-popconfirm
              title="确定要删除该条目吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleRemove({ id: record.id })"
              @cancel="() => {}"
            >
              <a-button type="link" class="action-btn">删除</a-button>
            </a-popconfirm>
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
import {
  getMyErrorCorrectionList,
  delErrorCorrection,
} from '@/services/myKnowledge/errorCorrection';
import { FormStateType } from '@/types/myKnowledge/knowledge';
import { knowledgeFlag } from '@/constants/index';
import ViewCorrectionDialog from './sections/ViewCorrectionDialog.vue';
import SearchLabelSelect from '@/components/SearchLabelSelect/index.vue';

const router = useRouter();

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '类型',
      dataIndex: 'knowledgeFlag',
      key: 'knowledgeFlag',
      align: 'center',
      customRender: ({ text }: { text: number }) => {
        return knowledgeFlag[text as keyof typeof knowledgeFlag];
      },
    },
    {
      title: '知识条目',
      dataIndex: 'knowledgeName',
      key: 'knowledgeName',
      align: 'center',
    },
    {
      title: '分类',
      dataIndex: 'knowledgeTypeName',
      key: 'knowledgeTypeName',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        if (text) {
          return text.split(', ').join('-');
        }
        return '';
      },
    },
    {
      title: '纠错时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const formState: UnwrapRef<FormStateType> = reactive({
  knowledgeName: '',
  labelId: '',
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
  fetchData: getMyErrorCorrectionList,
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

const handleRemove = async (record: { id: string }) => {
  await delErrorCorrection({ knowledgeId: record.id });
  message.success('删除成功');
  getList();
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
