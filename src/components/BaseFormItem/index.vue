<template>
  <a-form-item :label="field.label" v-bind="type === 'readonly' ? {} : validateInfos[fieldkey]">
    <template v-if="type !== 'readonly'">
      <a-cascader v-if="field.type === 'cascader'" v-model:value="modelRef[fieldkey]" :options="field.options"
        placeholder="请选择" :disabled="disabled" />
      <a-select v-if="field.type === 'select'" v-model:value="modelRef[fieldkey]" :options="field.options"
        placeholder="请选择" :disabled="disabled">
      </a-select>
      <a-input v-if="field.type === 'input'" v-model:value="modelRef[fieldkey]" placeholder="请输入"
        :disabled="disabled" />
      <a-input-number v-if="field.type === 'number'" v-model:value="modelRef[fieldkey]" :step="0.01" placeholder="请输入"
        :min="0" :disabled="disabled" />
      <a-radio-group v-if="field.type === 'radio'" v-model:value="modelRef[fieldkey]" :options="field.options"
        :disabled="disabled" />
      <ImgUpload v-if="field.type === 'img-upload'" v-model="modelRef[fieldkey]" :max-length="field.maxCount || 1"
        :crop="field.crop || false" :disabled="disabled" />
      <ImgDescGroup v-if="field.type === 'img-desc-group'" v-model="modelRef[fieldkey]" />
    </template>
    <template v-else>
      <ImgUpload v-if="field.type === 'img-upload'" v-model="modelRef[fieldkey]"
        :max-length="modelRef[fieldkey].length || 1" disabled />
      <ImgDescGroup v-if="field.type === 'img-desc-group'" v-model="modelRef[fieldkey]"
        :max-length="modelRef[fieldkey].length || 1" disabled />
      <div v-if="field.type !== 'img-upload' && field.type !== 'img-desc-group'">
        {{
            fieldkey === 'cost_amount' || fieldkey === 'tag_amount' ? '￥' +
              Number(modelRef[fieldkey]).toFixed(2) : modelRef[fieldkey]
        }}
      </div>
    </template>
  </a-form-item>
</template>

<script lang="ts" setup>
import type { validateInfos } from 'ant-design-vue/lib/form/useForm';
import ImgUpload from '@/components/ImgUpload/index.vue';
import ImgDescGroup from '@/components/ImgDescGroup/index.vue';

export interface OptionsItemType {
  label: string;
  value: string | number;
}

export interface FieldType {
  type: string;
  label: string;
  options?: OptionsItemType[];
  /* 当类型为图片上传时是否支持裁切 */
  crop?: boolean;
  /* 当类型为图片上传时最多支持上传数量限制 */
  maxCount?: number;
}

interface Props {
  /* 功能描述对象 */
  field: FieldType;
  /* 父级页面类型： 只读、可编辑、创建、复制 */
  type: "readonly" | "edit" | "create" | "copy";
  /* 双向绑定值 */
  modelRef: Record<string, any>;
  /* 字段key */
  fieldkey: string;
  /* useForm返回的检验信息 */
  validateInfos: validateInfos;
  disabled?: boolean;
}

const props = defineProps<Props>();
</script>
