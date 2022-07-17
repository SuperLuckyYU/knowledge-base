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
    <a-checkbox-group v-model:value="roleIds">
      <a-row v-for="item in roleList">
        <a-col :span="24">
          <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
        </a-col>
      </a-row>
    </a-checkbox-group>
  </a-modal>
</template>

<script lang="ts" setup>
import type { UserItemType } from '@/services/systemSetter/users';
import type {
  RoleListProps,
  RoleListReturnProps,
  RoleListItemProps,
} from '@/services/systemSetter/role';
import { ref, toRefs } from 'vue';
import { getRoleList } from '@/services/systemSetter/role';
import { setRole } from '@/services/systemSetter/users';
import { message } from 'ant-design-vue';

interface Props {
  info: UserItemType[];
}

const props = defineProps<Props>();
const { info } = toRefs(props);
const emit = defineEmits(['success', 'cancel']);

const roleIds = ref<string[]>([]);
const roleList = ref<{ label: string; value: string }[]>([]);

const fetchRoleList = async () => {
  const { records } = await getRoleList<RoleListProps, RoleListReturnProps>({});
  roleList.value = records.map(({ roleName, roleDesc, id }: RoleListItemProps) => ({
    label: `${roleName}（${roleDesc}）`,
    value: id,
  }));
};

fetchRoleList();

const handleSubmit = async () => {
  const userIds = info.value
    .map((item) => {
      return item.puserId;
    })
    .join(',');
  const params = {
    userIds,
    roleIds: roleIds.value.join(','),
  };
  await setRole(params);
  message.success('设置成功');
  emit('success');
  onModalClose();
};
// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};
</script>
