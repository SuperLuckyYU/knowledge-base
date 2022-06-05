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
            <a-form-item label="角色" name="category">
              <a-cascader
                style="min-width: 250px"
                v-model:value="formState.role"
                :options="roleOptions"
                placeholder="请选择角色"
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
    <a-row class="mt20">
      <a-col :span="8">
        <a-card class="mr15" title="组织结构">
          <a-tree
            :tree-data="organizationData"
            defaultExpandAll
            v-model:selectedKeys="selectedNodes"
          ></a-tree>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card>
          <a-row class="action-btn-box">
            <a-button
              class="mr15"
              type="primary"
              :disabled="!selectedRows.length"
              @click="handleSettingRole"
              >设置角色</a-button
            >
            <a-button danger @click="handleRecyclingPermissions" :disabled="!selectedRows.length"
              >回收权限</a-button
            >
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
                <a-button type="link" class="action-btn" @click="handleViewLog(record)"
                  >查看操作日志</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <setting-role-dialog
      v-if="settingRoleDialogState.visible"
      :info="selectedRows"
      @success="getList"
      @cancel="handleCancelSettingRoleDialog"
    />
    <recycing-role-dialog
      v-if="RecyclingPermissionsDialogState.visible"
      :info="selectedRows"
      @success="getList"
      @cancel="handleCancelRecyclingPermissionsDialog"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'UsersList',
};
</script>
<script lang="ts" setup>
import type { TableProps } from 'ant-design-vue';
import type { FormStateType } from '@/types/systemSetter/users';
import type { UserItemType } from '@/services/systemSetter/users';
import { reactive, ref, UnwrapRef } from 'vue';
import { getProductList } from '@/services/goods';
import useSearchTableList from '@/composables/useSearchTableList';
import SettingRoleDialog from './sections/SettingRoleDialog.vue';
import RecycingRoleDialog from './sections/RecyclingPermissions.vue';

interface ModelStateType {
  visible: boolean;
}

const roleOptions = ref([
  {
    label: '超级管理员',
    value: '00',
  },
  {
    label: '子系统管理员',
    value: '01',
  },
  {
    label: '业务导员',
    value: '02',
  },
  {
    label: '局领导',
    value: '03',
  },
]);

const columns = [
  {
    title: '账号',
    dataIndex: 'account',
    key: 'account',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '职务',
    dataIndex: 'job_title',
    key: 'job_title',
    align: 'center',
  },
  {
    title: '办公室电话',
    dataIndex: 'tel',
    key: 'tel',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
  },
  {
    title: '直接上级',
    dataIndex: 'direct_superior',
    key: 'direct_superior',
    align: 'center',
  },
  {
    title: '系统角色',
    dataIndex: 'system_role',
    key: 'system_role',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const selectedRows = ref<UserItemType[]>([]);

const organizationData = ref([
  {
    title: '海淀区水务局',
    key: '1',
    children: [
      {
        title: '局领导',
        key: '2',
      },
      {
        title: '局长办公会',
        key: '3',
      },
      {
        title: '局党组会',
        key: '4',
      },
      {
        title: '机关',
        key: '5',
        children: [
          { title: '办公室', key: '0-0-3-0' },
          { title: '水资源管理及行政审批科', key: '0-0-3-1' },
          { title: '节水管理科', key: '0-0-3-2' },
        ],
      },
      {
        title: '事业单位',
        key: '6',
        children: [
          { title: '海淀区水政监察大队', key: '0-0-4-0' },
          { title: '海淀区水利工程质量监督站', key: '0-0-4-1' },
          { title: '海淀区节约用水事务管理中心', key: '0-0-4-2' },
        ],
      },
    ],
  },
]);

const selectedNodes = ref<string[]>([]);

const formState: UnwrapRef<FormStateType> = reactive({
  name: '',
  role: [],
});

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: UserItemType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

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

// 回收权限弹窗相关
const RecyclingPermissionsDialogState = reactive<ModelStateType>({
  visible: false,
});

const handleRecyclingPermissions = () => {
  RecyclingPermissionsDialogState.visible = true;
};

const handleCancelRecyclingPermissionsDialog = () => {
  RecyclingPermissionsDialogState.visible = false;
};

// 设置角色弹窗相关
const settingRoleDialogState = reactive<ModelStateType>({
  visible: false,
});

const handleSettingRole = () => {
  settingRoleDialogState.visible = true;
};

const handleCancelSettingRoleDialog = () => {
  settingRoleDialogState.visible = false;
};

const handleViewLog = (record: unknown) => {};
</script>

<style lang="less" scoped>
.action-btn {
  padding: 0 5px;
}
</style>
