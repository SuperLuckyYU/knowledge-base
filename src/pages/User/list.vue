<template>
  <div>
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="姓名" name="userName">
              <a-input
                v-model:value.trim="formState.userName"
                placeholder="请输入姓名"
                autocomplete="off"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="角色" name="rid">
              <a-cascader
                style="min-width: 250px"
                v-model:value="formState.rid"
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
            :field-names="{ title: 'deptName', key: 'id', children: 'children' }"
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
              :disabled="!selectedRowsRef.length"
              @click="handleSettingRole"
              >设置角色</a-button
            >
            <a-button danger @click="handleRecyclingPermissions" :disabled="!selectedRowsRef.length"
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
      :info="selectedRowsRef"
      @success="getList"
      @cancel="handleCancelSettingRoleDialog"
    />
    <recycing-role-dialog
      v-if="RecyclingPermissionsDialogState.visible"
      :info="selectedRowsRef"
      @success="getList"
      @cancel="handleCancelRecyclingPermissionsDialog"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'UserList',
};
</script>
<script lang="ts" setup>
import type { TableProps } from 'ant-design-vue';
import type { FormStateType } from '@/types/systemSetter/users';
import type { UserItemType, DeptListReturnProps } from '@/services/systemSetter/users';
import { reactive, ref, UnwrapRef, watch } from 'vue';
import { getUserList, getDeptList } from '@/services/systemSetter/users';
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
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
  },
  {
    title: '职务',
    dataIndex: 'position',
    key: 'position',
    align: 'center',
  },
  {
    title: '办公室电话',
    dataIndex: 'officeTelephone',
    key: 'officeTelephone',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'moblie',
    key: 'moblie',
    align: 'center',
  },
  {
    title: '直接上级',
    dataIndex: 'higherUp',
    key: 'higherUp',
    align: 'center',
  },
  {
    title: '系统角色',
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'center',
  },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   align: 'center',
  // },
];

const selectedRowsRef = ref<UserItemType[]>([]);

const organizationData = reactive<DeptListReturnProps>([]);

const selectedNodes = ref<string[]>([]);

const formState: UnwrapRef<FormStateType> = reactive({
  userName: '',
  rid: [],
});

watch(selectedNodes, (_) => {
  if (selectedNodes.value.length > 0) {
    formState['deptId'] = selectedNodes.value[0];
  } else {
    formState['deptId'] = '';
  }
});

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: UserItemType[]) => {
    selectedRowsRef.value = selectedRows;
  },
};

// 获取数据
const { onSearch, onReset, pagination, dataSource, searchFormRef, onTableChange, getList } =
  useSearchTableList({
    fetchData: getUserList,
    formatParams() {
      const data: Record<string, any> = { ...formState };
      return data;
    },
  });

const fetchOrganizationData = async () => {
  const res = await getDeptList();
  Object.assign(organizationData, res);
};

fetchOrganizationData();

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
