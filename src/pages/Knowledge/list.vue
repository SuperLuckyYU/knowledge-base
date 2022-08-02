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
      <a-row class="action-btn-box" v-if="hasOperateAuth">
        <a-button
          class="mr15"
          style="background-color: #36bc62; border-color: #36bc62"
          type="primary"
          @click="handleOperateKnowledge({ id: '' }, 'create')"
          >新建知识</a-button
        >
        <a-button class="mr15" @click="handleClickUpload">批量上传文档</a-button>
        <a-button @click="handleClickCreateTopic({ id: '' }, 'create')">新建专题</a-button>
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
          <template v-if="column.dataIndex === 'knowledgeName'">
            <router-link :to="{ name: 'ArticleDetail', query: { id: record.id } }">{{
              text
            }}</router-link>
          </template>
          <template v-if="column.dataIndex === 'operation'">
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
            <a-button
              type="link"
              class="action-btn"
              @click="
                handleOperateKnowledge(
                  { id: record.id, knowledgeFlag: record.knowledgeFlag },
                  'update',
                )
              "
              >编辑
            </a-button>
            <a-popconfirm
              title="确定要删除此项目吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleRemove(record.id)"
              @cancel="() => {}"
            >
              <a-button type="link" class="action-btn">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <bulk-upload-documents-dialog
    v-if="uploadDocumentsState.visible"
    @success="getList"
    @cancel="handleCloseUploadDialog"
  />
</template>

<script lang="ts">
export default {
  name: 'KnowledgeList',
};
</script>

<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/moudles/user';
import useSearchTableList from '@/composables/useSearchTableList';
import useShare from '@/composables/useShare';
import { getMyKnowledgeList, delKnowledge } from '@/services/myKnowledge/knowledge';
import { FormStateType } from '@/types/myKnowledge/knowledge';
import { knowledgeFlag } from '@/constants/index';
import BulkUploadDocumentsDialog from './sections/BulkUploadDocumentsDialog.vue';
import SearchLabelSelect from '@/components/SearchLabelSelect/index.vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const currentRouteKey = route.meta.key;
const hasOperateAuth = computed(
  () => userStore.menuOperateAuthMap[currentRouteKey as keyof typeof userStore.menuOperateAuthMap],
);

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  const arr = [
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
      width: 300,
      ellipsis: true,
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '最后编辑时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
  if (!hasOperateAuth.value) {
    arr.pop();
  }
  return arr;
});

const formState: UnwrapRef<FormStateType> = reactive({
  knowledgeName: '',
  labelId: '',
  sortType: 'createTime',
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
  fetchData: getMyKnowledgeList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    return data;
  },
});

const handleOperateKnowledge = (
  record: { id: string; knowledgeFlag?: number },
  type: 'create' | 'update',
) => {
  if (record.knowledgeFlag === 3) {
    return router.push({
      name: 'KnowledgeCreateTopic',
      query: record.id
        ? {
            id: record.id,
            type: type,
          }
        : {
            type: type,
          },
    });
  }
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

const handleClickCreateTopic = (record: { id: string }, type: 'create' | 'update') => {
  router.push({
    name: 'KnowledgeCreateTopic',
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

const handleRemove = async (id: string) => {
  await delKnowledge({ id });
  message.success('删除成功！');
  getList();
};

const uploadDocumentsState = reactive({
  visible: false,
});

const handleClickUpload = () => {
  uploadDocumentsState.visible = true;
};

const handleCloseUploadDialog = () => {
  uploadDocumentsState.visible = false;
};

const { share } = useShare();
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
