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
            <a-form-item label="内容" name="content">
              <a-input
                v-model:value.trim="formState.content"
                placeholder="请输入内容"
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
          <!-- <a-col>
            <a-form-item label="标签" name="labelId">
              <search-label-select v-model:value="formState.labelId" />
            </a-form-item>
          </a-col> -->
          <a-col>
            <a-form-item label="项目" name="itemId">
              <search-project-select v-model:value="formState.itemId" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="排序方式" name="sortType">
              <a-select v-model:value="formState.sortType" style="width: 120px" allow-clear>
                <a-select-option value="createTime">创建时间</a-select-option>
                <a-select-option value="browseNum">浏览量</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="创建时间" name="dateRange">
              <a-range-picker
                v-model:value="formState.dateRange"
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
    <a-row>
      <a-col :span="4">
        <type-tree
          v-model:knowledgeType="formState.knowledgeType"
          v-model:knowledgeFlag="formState.knowledgeFlag"
          @change="handleKnowledgeTypeChange"
        />
      </a-col>
      <a-col :span="20">
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
                <a-tooltip>
                  <template #title>{{ text }}</template>
                  <router-link
                    :to="{
                      name: 'ArticleDetail',
                      query: { id: record.id, contentKeyword: formState.content },
                    }"
                    >{{ text }}</router-link
                  >
                </a-tooltip>
              </template>
              <template v-if="column.dataIndex === 'deadline'">
                {{ record.expirationType === '0' ? '永久有效' : record.endTime }}
              </template>
            </template>
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
import { reactive, computed, UnwrapRef, h } from 'vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getKnowledgeList } from '@/services/home';
import { knowledgeFlag } from '@/constants/index';
import TypeTree from './sections/TypeTree.vue';
// import SearchLabelSelect from '@/components/SearchLabelSelect/index.vue';
import SearchProjectSelect from '@/components/SearchProjectSelect/index.vue';

const columns = computed(() => {
  return [
    {
      title: '知识条目',
      dataIndex: 'knowledgeName',
      key: 'knowledgeName',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
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
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      width: 200,
      customRender: ({ text }: { text: string }) => {
        if (text) {
          if (formState.content) {
            const sentences = text.replace(/<[^>]+>/g, '').split(/[,.;!？，。；！]/g);
            // 遍历每个句子，查找是否包含关键字
            for (const sentence of sentences) {
              // 使用正则表达式进行不区分大小写的关键字检索
              const regex = new RegExp(formState.content, 'gi');
              if (regex.test(sentence)) {
                const str = sentence.trim().substring(0, 100) + '...';
                const newStr = str.replace(
                  regex,
                  (match) =>
                    `<span style="color: rgb(215, 67, 64); font-size: 18px">${match}</span>`,
                );
                return h('div', { innerHTML: newStr });
              }
            }
          }
          return text.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
        }
        return '';
      },
    },
    {
      title: '安全级别',
      dataIndex: 'securityLevelName',
      key: 'securityLevelName',
      align: 'center',
    },
    {
      title: '有效期',
      dataIndex: 'deadline',
      key: 'deadline',
      align: 'center',
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
    },
  ];
});

const dateFormat = 'YYYY-MM-DD';

const formState: UnwrapRef<FormStateType> = reactive({
  knowledgeFlag: '',
  knowledgeType: '',
  knowledgeName: '',
  author: '',
  // labelId: '',
  itemId: '',
  dateRange: [],
  sortType: 'createTime',
  content: '',
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
    const dateRange = formState.dateRange;
    const data: Record<string, any> = {
      ...formState,
    };
    delete data.dateRange;
    if (dateRange.length) {
      data['startTime'] = dateRange[0];
      data['endTime'] = dateRange[1];
    }
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
