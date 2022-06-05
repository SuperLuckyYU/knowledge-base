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
    <a-radio-group v-model:value="value">
      <a-radio :value="1">知识库管理员（能管理本系统的用户，审核知识、归档知识）</a-radio>
      <a-radio :value="2"
        >普通业务人员（能新增知识条目、专题，能纠错知识等，但提交的知识要经管理员审核）</a-radio
      >
    </a-radio-group>
  </a-modal>
</template>

<script lang="ts" setup>
import type { UserItemType } from '@/services/systemSetter/users';
import { ref } from 'vue';

interface Props {
  info: UserItemType[];
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const value = ref<number>(1);
const handleSubmit = async () => {
  emit('success');
  onModalClose();
};
// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};
</script>
