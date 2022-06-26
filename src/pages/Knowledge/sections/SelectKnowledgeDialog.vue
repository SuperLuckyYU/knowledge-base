<template>
  <a-modal
    title="选择知识条目"
    :visible="true"
    :maskClosable="false"
    :closable="false"
    centered
    width="80%"
    destroyOnClose
    :body-style="{ height: '80vh', 'overflow-y': 'auto' }"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="标题" name="knowledgeName">
              <a-input
                v-model:value.trim="formState.knowledgeName"
                placeholder="请输入知识条目标题"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="onSearch">查询</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <select-knowledge-table
      rowKey="id"
      :data-source="dataSource"
      :pagination="pagination"
      bordered
      @change="(onTableChange as any)"
    >
      <template #operation="{ record }">
        <a-button
          :type="record.checked ? 'primary' : ''"
          :disabled="record.disabled"
          @click="handleChange(record)"
          >{{ record.checked ? '已添加' : '添加' }}</a-button
        >
      </template>
    </select-knowledge-table>
  </a-modal>
</template>
<script lang="ts" setup>
import { reactive, onMounted, UnwrapRef, toRefs } from 'vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getMyKnowledgeList } from '@/services/myKnowledge/knowledge';
import SelectKnowledgeTable from './SelectKnowledgeTable.vue';
interface StateType {
  selectedRow: Record<string, any>[];
}
interface Props {
  selectedRows: Record<string, any>[];
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const { selectedRows } = toRefs(props);
const state: UnwrapRef<StateType> = reactive({
  selectedRow: [],
});
const formState = reactive({
  knowledgeName: '',
});

// 获取数据
const { onSearch, onReset, pagination, dataSource, getList, searchFormRef, onTableChange } =
  useSearchTableList({
    fetchData: getMyKnowledgeList,
    formatParams() {
      return formState;
    },
    pageSize: 10,
    formatResponse(res) {
      const { records, total } = res;
      selectedRows.value.forEach((selectedItem) => {
        records.forEach((listItem: Record<string, any>) => {
          if (selectedItem.id === listItem.id) {
            listItem.checked = true;
          }
        });
      });

      return {
        list: records,
        total: total,
      };
    },
  });

const handleChange = (row: Record<string, any>) => {
  row.checked = !row.checked;
  if (row.checked) {
    state.selectedRow.push(row);
  } else {
    state.selectedRow.splice(
      state.selectedRow.findIndex((item) => item.id == row.id),
      1,
    );
  }
};

const handleSubmit = () => {
  const data = {
    selectedRows: state.selectedRow,
  };
  emit('success', data);
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};

onMounted(async () => {
  await getList();
});
</script>
