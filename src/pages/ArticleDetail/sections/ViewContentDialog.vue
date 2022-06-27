<template>
  <a-modal
    title="查看修订内容"
    :visible="true"
    :maskClosable="false"
    :closable="false"
    width="600px"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-row class="mb15">
      <a-col :span="5">
        <div>内容:</div>
      </a-col>
      <a-col :span="19">
        <div v-html="content"></div>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, toRefs } from 'vue';

interface Props {
  content: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const { content } = toRefs(props);

const handleSubmit = () => {
  emit('success');
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};
</script>

<style lang="less" scoped></style>
