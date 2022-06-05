<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="姓名" name="name">
              <a-input
                v-model:value.trim="formState.name"
                placeholder="请输入姓名"
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
        <a-button type="primary" @click="handleCreate('create')">新建</a-button>
      </a-row>
      <a-table
        rowKey="id"
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
            <a-button type="link" class="action-btn" @click="handleDelete(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <create-role-dialog
      v-if="CreateRoleDialogState.visible"
      :type="CreateRoleDialogState.type"
      :info="(CreateRoleDialogState.currentRow as RoleItemType)"
      @success="getList"
      @cancel="handleCancelCreateRoleDialog"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'UsersList',
};
</script>
<script lang="ts" setup>
import type { FormStateType } from '@/types/systemSetter/role';
import type { RoleItemType } from '@/services/systemSetter/role';
import { reactive, UnwrapRef } from 'vue';
import { getProductList } from '@/services/goods';
import useSearchTableList from '@/composables/useSearchTableList';
import CreateRoleDialog from './sections/CreateRoleDialog.vue';

interface ModelStateType {
  visible: boolean;
  currentRow: RoleItemType | {};
  type: 'create' | 'update';
}

const columns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '模块',
    dataIndex: 'module',
    key: 'module',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const formState: UnwrapRef<FormStateType> = reactive({
  name: '',
});

// 获取数据
const { onSearch, onReset, pagination, dataSource, searchFormRef, onTableChange, getList } =
  useSearchTableList({
    fetchData: getProductList,
    formatParams() {
      const data: Record<string, any> = { ...formState };
      return data;
    },
    listFormatEnum: true,
  });

const handleDelete = (row: RoleItemType) => {};

const CreateRoleDialogState = reactive<ModelStateType>({
  visible: false,
  currentRow: {},
  type: 'create',
});

// 创建更新角色
const handleCreate = (type: 'create' | 'update', row?: RoleItemType) => {
  CreateRoleDialogState.visible = true;
  CreateRoleDialogState.type = type;
  if (row) CreateRoleDialogState.currentRow = row;
};

const handleCancelCreateRoleDialog = () => {
  CreateRoleDialogState.visible = false;
};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
