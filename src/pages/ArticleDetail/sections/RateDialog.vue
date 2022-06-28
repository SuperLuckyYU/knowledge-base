<template>
  <a-modal
    width="400px"
    title="评价"
    :visible="true"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form v-bind="layout">
      <a-form-item label="评分" v-bind="validateInfos.rate">
        <a-rate v-model:value="modelRef.rate" />
        <span class="ant-rate-text">{{ modelRef.rate }}分</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import { message, Form } from 'ant-design-vue';
import { rateKnowledge } from '@/services/myKnowledge/knowledge';

interface Props {
  knowledgeId: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const { knowledgeId } = toRefs(props);

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
});

const modelRef = reactive<{ rate: number }>({
  rate: 1,
});

const rulesRef = reactive({
  rate: [
    {
      required: true,
      message: '请选择分数！',
    },
  ],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const handleSubmit = async () => {
  try {
    const formState = await validate();
    await rateKnowledge({ ...formState, knowledgeId: knowledgeId.value });
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
