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
            <a-form-item label="标题" name="name">
              <a-input
                v-model:value.trim="formState.name"
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
import { reactive, onMounted, toRefs, UnwrapRef } from 'vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList } from '@/services/goods';
import SelectKnowledgeTable from './SelectKnowledgeTable.vue';
interface StateType {
  selectedRow: Record<string, any>[];
}
const emit = defineEmits(['success', 'cancel']);

const state: UnwrapRef<StateType> = reactive({
  selectedRow: [],
});
const formState = reactive({
  name: '',
});

// 获取数据
const { onSearch, onReset, pagination, dataSource, getList, searchFormRef, onTableChange } =
  useSearchTableList({
    fetchData: getProductList,
    formatParams() {
      return formState;
    },
    listFormatEnum: false,
    pageSize: 10,
    formatResponse(res) {
      const { list, total_num } = res.result;
      return {
        list: list,
        total: total_num,
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
