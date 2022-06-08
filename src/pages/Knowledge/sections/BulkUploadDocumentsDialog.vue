<template>
  <a-modal
    width="600px"
    title="批量上传文档"
    :visible="true"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form v-bind="layout">
      <a-form-item label="文档" v-bind="validateInfos.fileList">
        <a-upload-dragger
          v-model:fileList="modelRef.fileList"
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">单击或拖动文件到该区域进行上传</p>
          <p class="ant-upload-hint">支持单次或批量上传</p>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item label="知识分类" v-bind="validateInfos.category">
        <a-input v-model:value="modelRef.category" placeholder="请选择知识分类" />
      </a-form-item>
      <a-form-item label="设置标签" v-bind="validateInfos.label">
        <knowledge-label v-model="modelRef.label" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { UploadChangeParam } from 'ant-design-vue';
import type { UploadDocumentFormState } from '@/types/myKnowledge/knowledge';
import { reactive } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { message, Form } from 'ant-design-vue';
import KnowledgeLabel from './KnowledgeLabel.vue';

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

const modelRef = reactive<UploadDocumentFormState>({
  fileList: [],
  category: '',
  label: [],
});

const rulesRef = reactive({
  fileList: [
    {
      required: true,
      message: '请选择文件！',
    },
  ],
  category: [
    {
      required: true,
      message: '请选择知识分类！',
    },
  ],
  label: [
    {
      required: false,
    },
  ],
});

const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} 文件上传成功。`);
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const handleSubmit = async () => {
  try {
    const params = await validate();
    console.log(
      '🚀 ~ file: BulkUploadDocumentsDialog.vue ~ line 52 ~ handleSubmit ~ params',
      params,
    );
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
