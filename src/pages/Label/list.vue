<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="标签名称" name="labelName">
              <a-input
                v-model:value.trim="formState.labelName"
                placeholder="请输入标签名称"
                autocomplete="off"
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
    <a-card>
      <a-row class="action-btn-box">
        <a-button class="mr15" type="primary" @click="handleCreate('create')">新建</a-button>
        <a-popconfirm
          title="确认要删除所选标签吗？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDelete(selectedRowsRef)"
          @cancel="() => {}"
          :disabled="!selectedRowsRef.length"
        >
          <a-button danger :disabled="!selectedRowsRef.length">删除</a-button>
        </a-popconfirm>
      </a-row>
      <a-table
        rowKey="id"
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        bordered
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleCreate('update', record)"
              >编辑</a-button
            >
            <a-button type="link" class="action-btn" @click="handleDelete([record])">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <create-dialog
      v-if="CreateDialogState.visible"
      :type="CreateDialogState.type"
      :info="(CreateDialogState.currentRow as LabelItemType)"
      @success="getList"
      @cancel="handleCancelCreateDialog"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'LabelList',
};
</script>
<script lang="ts" setup>
import { message, TableProps } from 'ant-design-vue';
import type { FormStateType } from '@/types/systemSetter/label';
import type { LabelItemType } from '@/services/systemSetter/label';
import { reactive, UnwrapRef, computed, ref } from 'vue';
import { getLabelList, delLabel } from '@/services/systemSetter/label';
import useSearchTableList from '@/composables/useSearchTableList';
import CreateDialog from './sections/CreateDialog.vue';

interface ModelStateType {
  visible: boolean;
  currentRow: LabelItemType | {};
  type: 'create' | 'update';
}

const formState: UnwrapRef<FormStateType> = reactive({
  labelName: '',
});

const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  return [
    {
      title: '知识标签',
      dataIndex: 'labelName',
      key: 'labelName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'labelCreator',
      key: 'labelCreator',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];
});

const selectedRowsRef = ref<LabelItemType[]>([]);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: LabelItemType[]) => {
    selectedRowsRef.value = selectedRows;
  },
};

// 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  searchFormRef,
  onTableChange,
  getList,
  sortedInfo,
} = useSearchTableList({
  fetchData: getLabelList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    return data;
  },
});

// 创建&编辑标签弹窗相关
const CreateDialogState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
  type: 'create',
});

const handleCreate = (type: 'create' | 'update', currentRow?: LabelItemType) => {
  CreateDialogState.visible = true;
  if (currentRow) CreateDialogState.currentRow = currentRow;
  CreateDialogState.type = type;
};

const handleCancelCreateDialog = () => {
  CreateDialogState.visible = false;
};

const handleDelete = async (selectedRows: LabelItemType[]) => {
  const ids = selectedRows
    .map((item) => {
      return item.id;
    })
    .join(',');
  await delLabel({ ids });
  message.success('删除成功！');
  getList();
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
