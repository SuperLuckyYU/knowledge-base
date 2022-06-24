<!-- 设置角色弹窗 -->
<template>
  <a-modal
    title="设置角色"
    :visible="true"
    :closable="false"
    width="600px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-radio-group v-model:value="roleId">
      <a-radio v-for="item in roleList" :value="item.id"
        >{{ item.roleName }}（{{ item.roleDesc }}）</a-radio
      >
    </a-radio-group>
  </a-modal>
</template>

<script lang="ts" setup>
import type { UserItemType } from '@/services/systemSetter/users';
import type { RoleListProps, RoleListReturnProps } from '@/services/systemSetter/role';
import { ref, toRefs } from 'vue';
import { getRoleList } from '@/services/systemSetter/role';
import { setRole } from '@/services/systemSetter/users';

interface Props {
  info: UserItemType[];
}

const props = defineProps<Props>();
const { info } = toRefs(props);
const emit = defineEmits(['success', 'cancel']);

const roleId = ref<string>('');
const roleList = ref<RoleListReturnProps[]>([]);

const fetchRoleList = async () => {
  const { records } = await getRoleList<RoleListProps, RoleListReturnProps>({});
  roleList.value = records;
};

fetchRoleList();

const handleSubmit = async () => {
  const userId = info.value.map(item => {return item.id}).join(',');
  const params = {
    userId,
    roleIds: [roleId.value + '']
  }
  const res = await setRole(params)
  console.log("🚀 ~ file: SettingRoleDialog.vue ~ line 52 ~ handleSubmit ~ res", res)
  emit('success');
  onModalClose();
};
// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};
</script>
