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
          <!-- <a-col>
            <a-form-item label="状态" name="state">
              <a-select
                v-model:value="formState.state"
                :options="stateOptions"
                placeholder="请选择分类"
              ></a-select>
            </a-form-item>
          </a-col> -->
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
            <a-button type="link" class="action-btn" @click="handleArchive({ id: record.id })"
              >归档
            </a-button>
            <a-button
              type="link"
              class="action-btn"
              @click="
                share({
                  id: record.id,
                  title: record.knowledgeName,
                  type: record.knowledgeFlag,
                  endTime: record.expirationType === '0' ? '永久有效' : record.endTime,
                })
              "
              >分享</a-button
            >
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AuditList',
};
</script>

<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import useSearchTableList from '@/composables/useSearchTableList';
import useShare from '@/composables/useShare';
import { getAudiList, AudieKnowledge } from '@/services/myKnowledge/audi';
import { FormStateType } from '@/types/myKnowledge/audit';
import { knowledgeFlag } from '@/constants/index';
import SearchLabelSelect from '@/components/SearchLabelSelect/index.vue';

const router = useRouter();

const stateOptions = reactive([
  {
    label: '全部',
    value: '',
  },
  {
    label: '未归档',
    value: '0',
  },
  {
    label: '已归档',
    value: '1',
  },
]);

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '类型',
      dataIndex: 'knowledgeFlag',
      key: 'knowledgeFlag',
      align: 'center',
      width: 80,
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
      width: 80,
      customRender: ({ text }: { text: string }) => {
        if (text) {
          return text.split(', ').join('-');
        }
        return '';
      },
    },
    // {
    //   title: '状态',
    //   dataIndex: 'state',
    //   key: 'state',
    //   align: 'center',
    // },
    {
      title: '提交人',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 200,
    },
  ];
});

const formState: UnwrapRef<FormStateType> = reactive({
  knowledgeName: '',
  labelId: '',
  // state: '',
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
  fetchData: getAudiList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    return data;
  },
});

const handleArchive = async (record: { id: string }) => {
  await AudieKnowledge({ knowledgeId: record.id });
  message.success('归档成功');
  getList();
};

const { share } = useShare();
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
