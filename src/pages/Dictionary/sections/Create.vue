<!-- 创建&更新角色弹窗 -->
<template>
  <a-modal
    :visible="true"
    :title="type === 'create' ? '新建' : '更新'"
    :closable="false"
    width="400px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form v-bind="layout">
      <a-form-item label="名称" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" placeholder="请输入名称"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import { message, Form } from 'ant-design-vue';
import { createDictionary, updateDictionary } from '@/services/systemSetter/dictionary';

interface Props {
  type: 'create' | 'update';
  category: string;
  id: string;
  name: string;
}

interface FormState {
  name: string;
}

const props = defineProps<Props>();
const { type, name, category, id } = toRefs(props);
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
  name: type.value === 'update' ? name.value : '',
});

const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请填写名称！',
    },
  ],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const sendRequest = async (params: FormState) => {
  if (type.value === 'create') {
    return await createDictionary({
      dictName: params.name,
      dictPid: id.value,
      dictType: category.value,
    });
  }
  return await updateDictionary({
    dictName: params.name,
    id: id.value,
    dictType: category.value,
  });
};

const handleSubmit = async () => {
  try {
    const params = await validate();
    await sendRequest(params);
    message.success('成功！');
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
