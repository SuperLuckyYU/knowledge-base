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
          :custom-request="customUpload"
          :before-upload="beforeUpload"
          @remove="handleRemoveCallBack"
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
        <a-tree-select
          v-model:value="modelRef.category"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :fieldNames="{
            children: 'children',
            label: 'dictName',
            value: 'id',
          }"
          placeholder="请选择知识分类"
          allow-clear
          tree-default-expand-all
          :tree-data="categoryData"
        >
        </a-tree-select>
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
import type { UploadFile, FileType, UploadRequestOption } from '@/components/ImgUpload/interface';
import type { DictionaryReturnProps } from '@/services/systemSetter/dictionary';
import { reactive, createVNode, ref } from 'vue';
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Form, Modal } from 'ant-design-vue';
import { UploadImage } from '@/utils/uploadFile';
import { createDocKnowledge } from '@/services/myKnowledge/knowledge';
import { getDictionaryList } from '@/services/systemSetter/dictionary';
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

const categoryData = ref<DictionaryReturnProps>([]);

const fetchCategoryData = async () => {
  const res = await getDictionaryList({ type: '1' });
  categoryData.value = res;
};

fetchCategoryData();

const handleChange = ({ file }: UploadChangeParam<UploadFile<any>>) => {
  if (!file.status) {
    const index = modelRef.fileList.indexOf(file);
    const newFileList = modelRef.fileList.slice();
    newFileList.splice(index, 1);
    modelRef.fileList = newFileList;
  }
};

// Custom Upload
const beforeUpload = (file: FileType) => {
  return true;
};

const customUpload = async (
  { onSuccess, onError, file }: UploadRequestOption<any>,
  resend: boolean,
) => {
  const uploadImage = async (file: File) => {
    const res = await UploadImage(file);
    if (res) {
      onSuccess && onSuccess(res);
      // Tip：Compatible with picture preview on Safari browser
      modelRef.fileList[modelRef.fileList.length - 1].thumbUrl = res;
    } else {
      const msg = '上传失败';
      onError && onError(msg as any);
    }
  };

  // Send Upload Request
  uploadImage(file as File);
};

// Remove Image/Video CallBack
const handleRemoveCallBack = (file: UploadFile<any>) => {
  if (file.status === 'error') return true;
  Modal.confirm({
    title: '确定删除吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: '',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const targetIndex = modelRef.fileList.indexOf(file);
      modelRef.fileList.splice(targetIndex, 1);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
  return false;
};

const genParams = ({
  fileList,
  category,
  label,
}: {
  fileList: UploadFile<string>[];
  category: string;
  label: string[];
}) => {
  return fileList.map((item) => ({
    accessory: item.response || '',
    knowledgeName: item.name,
    knowledgeType: category,
    knowledgeFlag: '1',
    labels: label.join(','),
  }));
};

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const handleSubmit = async () => {
  try {
    const formState = await validate();
    const parmas = genParams(formState);
    await createDocKnowledge(parmas);
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
