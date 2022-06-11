<template>
  <a-modal
    title="查看"
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
        <div>纠错内容:</div>
      </a-col>
      <a-col :span="19">
        内容描述中第三行有误，具体见图片，其次附件也非最后版本，可以找办公室索要最新版本进行更新完善，以便保障内容正确性
      </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <div>补充图片:</div>
      </a-col>
      <a-col :span="19">
        <img src="" class="pic" />
      </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <span class="label">附件列表: </span>
      </a-col>
      <a-col :span="10">
        <div class="file">海淀区水务局法定职责调整.pdf</div>
        <div class="file">海淀区水务局法定职责调整.pdf</div>
      </a-col>
      <a-col :span="2">
        <a-button type="link">下载</a-button>
      </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <div>纠错人:</div>
      </a-col>
      <a-col :span="19"> 李三元 </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <div>纠错时间:</div>
      </a-col>
      <a-col :span="19"> 2021-1-21 14:08 </a-col>
    </a-row>
  </a-modal>
</template>
<script lang="ts" setup>
import { reactive, onMounted, toRefs } from 'vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const { id } = toRefs(props);

const handleSubmit = () => {
  emit('success');
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};
</script>

<style lang="less" scoped>
.pic {
  width: 200px;
  height: 200px;
}
</style>
