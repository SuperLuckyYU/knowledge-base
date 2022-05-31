<template>
  <a-button type="primary" class="mb24" @click="handleAddRowClick">新增行</a-button>
  <div class="item-wrapper mb24" v-for="(item, index) in groupArr">
    <ImgUpload v-model="modelValue[index]['img']" :max-length="1" :crop="false" />
    <a-input class="desc-input" v-model:value="modelValue[index]['desc']" placeholder="请输入说明文字" />
    <a-button class="delete-btn" v-if="index !== 0" @click="handleRemoveItemClick(index)">删除行</a-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw } from 'vue';
import ImgUpload from '../ImgUpload/index.vue';

interface ModelRefItemType {
  img: [];
  desc: string
}

interface Props {
  modelValue: ModelRefItemType[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const groupArr = reactive(props.modelValue)

const handleAddRowClick = () => {
  groupArr.push({ img: [], desc: '' });
  emit('update:modelValue', toRaw(groupArr));
}

const handleRemoveItemClick = (index: number) => {
  groupArr.splice(index, 1);
  emit('update:modelValue', toRaw(groupArr));
}

</script>

<style lang='less' scoped>
.desc-input {
  width: 102px;
}

.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input {
  border-color: #d9d9d9 !important;
}

.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input:focus {
  box-shadow: none
}

.item-wrapper {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 35%;
  left: 120px;
}
</style>
