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

interface Props {
  info: UserItemType[];
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const handleSubmit = async () => {
  emit('success');
  onModalClose();
};
// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};
</script>
