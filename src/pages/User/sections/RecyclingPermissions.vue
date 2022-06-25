<!-- 回收权限弹窗 -->
<template>
  <a-modal
    :visible="true"
    :closable="false"
    width="400px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    确认回收该用户所有权限？
  </a-modal>
</template>

<script lang="ts" setup>
import type { UserItemType } from '@/services/systemSetter/users';
import { toRefs } from 'vue';
import { delRole } from '@/services/systemSetter/users';
import { message } from 'ant-design-vue';

interface Props {
  info: UserItemType[];
}

const props = defineProps<Props>();
const { info } = toRefs(props);
const emit = defineEmits(['success', 'cancel']);

const handleSubmit = async () => {
  const userIds = info.value
    .map((item) => {
      return item.id;
    })
    .join(',');
  const params = {
    userIds,
  };
  await delRole(params);
  message.success('回收成功');
  emit('success');
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};
</script>
