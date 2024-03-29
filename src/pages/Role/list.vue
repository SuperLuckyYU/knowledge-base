<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="角色名称" name="roleName">
              <a-input
                v-model:value.trim="formState.roleName"
                placeholder="请输入角色名称"
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
        <a-button
          style="background-color: #36bc62; border-color: #36bc62"
          type="primary"
          @click="handleCreate('create')"
          >新建</a-button
        >
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
  name: 'RoleList',
};
</script>
<script lang="ts" setup>
import type { FormStateType } from '@/types/systemSetter/role';
import type { RoleItemType } from '@/services/systemSetter/role';
import { reactive, UnwrapRef } from 'vue';
import { getRoleList, delRole } from '@/services/systemSetter/role';
import useSearchTableList from '@/composables/useSearchTableList';
import CreateRoleDialog from './sections/CreateRoleDialog.vue';
import { message } from 'ant-design-vue';

interface ModelStateType {
  visible: boolean;
  currentRow: RoleItemType | {};
  type: 'create' | 'update';
}

const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'center',
  },
  {
    title: '模块',
    dataIndex: 'roleModules',
    key: 'roleModules',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'roleDesc',
    key: 'roleDesc',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const formState: UnwrapRef<FormStateType> = reactive({
  roleName: '',
});

// 获取数据
const { onSearch, onReset, pagination, dataSource, searchFormRef, onTableChange, getList } =
  useSearchTableList({
    fetchData: getRoleList,
    formatParams() {
      const data: Record<string, any> = { ...formState };
      return data;
    },
  });

const handleDelete = async ({ id }: RoleItemType) => {
  await delRole({ roleId: id });
  message.success('删除成功！');
  getList();
};

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
