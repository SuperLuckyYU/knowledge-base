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
            <a-button type="link" class="action-btn" @click="handleCancelCollect({ id: record.id })"
              >取消收藏
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
  name: 'CollectionList',
};
</script>

<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/moudles/user';
import { getMyCollectionList, cancelCollecteKnowledge } from '@/services/myKnowledge/collection';
import { FormStateType } from '@/types/myKnowledge/knowledge';
import { knowledgeFlag } from '@/constants/index';
import useSearchTableList from '@/composables/useSearchTableList';
import useShare from '@/composables/useShare';
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
      title: '评分',
      dataIndex: 'evaluate',
      key: 'evaluate',
      align: 'center',
    },
    {
      title: '收藏时间',
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
  if (!hasOperateAuth.value) arr.pop();
  return arr;
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
  fetchData: getMyCollectionList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    return data;
  },
});

const handleCancelCollect = async (record: { id: string }) => {
  await cancelCollecteKnowledge({ knowledgeId: record.id });
  message.success('取消收藏成功');
  getList();
};

const { share } = useShare();
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
