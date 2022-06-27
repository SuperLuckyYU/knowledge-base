<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    :options="labelOptions"
    :filter-option="false"
    placeholder="请选择标签"
    @change="handleChange"
    @cancel="handleCancelLabelCreateDialog"
    @search="fetchLabel"
  >
    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0" />
      <div
        style="padding: 4px 8px; cursor: pointer"
        @mousedown="(e) => e.preventDefault()"
        @click="handleCreateLabel"
      >
        <plus-outlined />
        新增
      </div>
    </template>
  </a-select>
  <create-label-dialog
    v-if="CreateLabelDialogState.visible"
    :type="type"
    :info="({} as LabelItemType)"
    @success="fetchLabelList"
    @cancel="handleCancelLabelCreateDialog"
  />
</template>

<script lang="ts" setup>
import type { SetupContext } from 'vue';
import type { LabelItemType } from '@/services/systemSetter/label';
import { toRefs, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { cloneDeep, debounce } from 'lodash-es';
import useLabelState from '../composables/useLabelState';
import CreateLabelDialog from '../../Label/sections/CreateDialog.vue';

interface Props {
  modelValue: string[];
  type?: 'create' | 'update';
}

const VNodes = (_: unknown, { attrs }: SetupContext) => {
  return attrs.vnodes;
};

const props = defineProps<Props>();
const { modelValue, type = 'create' } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const value = ref<string[]>([]);
setTimeout(() => {
  value.value = cloneDeep(modelValue.value);
}, 1000);
const handleChange = (value: string[]) => {
  emit('update:modelValue', value);
};

const fetchLabel = debounce((value) => {
  fetchLabelList(value);
}, 300);

const {
  labelOptions,
  CreateLabelDialogState,
  handleCreateLabel,
  handleCancelLabelCreateDialog,
  fetchLabelList,
} = useLabelState();
</script>
