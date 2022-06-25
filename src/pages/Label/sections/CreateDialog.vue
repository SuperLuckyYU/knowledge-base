<!-- 创建&更新知识标签弹窗 -->
<template>
  <a-modal
    :visible="true"
    :title="type === 'create' ? '新建' : '编辑'"
    :closable="false"
    width="400px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form v-bind="layout">
      <a-form-item label="名称" v-bind="validateInfos.labelName">
        <a-input v-model:value="modelRef.labelName" placeholder="请输入标签名称"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type {
  LabelItemType,
  CreateLabelProps,
  UpdateLabelProps,
  CommonOpreateReturnType,
} from '@/services/systemSetter/label';
import { reactive, toRefs } from 'vue';
import { message, Form } from 'ant-design-vue';
import { createLabel, updateLabel } from '@/services/systemSetter/label';

interface Props {
  type: 'create' | 'update';
  info: LabelItemType;
}

interface FormState {
  labelName: string;
}

const props = defineProps<Props>();
const { type, info } = toRefs(props);
const emit = defineEmits(['success', 'cancel']);

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
});

const modelRef = reactive<FormState>({
  labelName: type.value === 'update' ? info.value.labelName : '',
});

const rulesRef = reactive({
  labelName: [
    {
      required: true,
      message: '请填写标签名称！',
    },
  ],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const fetchRequest = async (params: CreateLabelProps | UpdateLabelProps) => {
  if (type.value === 'create') {
    return await createLabel(params);
  }
  return await updateLabel(params as UpdateLabelProps);
};

const handleSubmit = async () => {
  try {
    const params = await validate();
    await fetchRequest(params);
    message.success('成功!');
    emit('success');
    onModalClose();
  } catch (error) {
    console.log('error', error);
  }
};

// 弹窗关闭
const onModalClose = () => {
  resetFields();
  emit('cancel', false);
};
</script>
