<template>
  <a-modal
    width="600px"
    title="内容纠错"
    :visible="true"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form v-bind="layout">
      <a-form-item label="内容" v-bind="validateInfos.content">
        <a-textarea
          v-model:value="modelRef.content"
          :rows="4"
          placeholder="请填写描述"
          :maxlength="6"
        />
      </a-form-item>
      <a-form-item label="补充图片" v-bind="validateInfos.picture">
        <ImgUpload v-model="modelRef.picture" :max-length="8" type="1" />
      </a-form-item>
      <a-form-item label="补充附件" v-bind="validateInfos.accessory">
        <a-upload-dragger
          v-model:fileList="modelRef.accessory"
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
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { UploadChangeParam } from 'ant-design-vue';
import type { CorrecteFormState } from '@/types/myKnowledge/errorCorrection';
import type { UploadFile, FileType, UploadRequestOption } from '@/components/ImgUpload/interface';
import { reactive, createVNode, ref, toRefs } from 'vue';
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Form, Modal } from 'ant-design-vue';
import { UploadImage } from '@/utils/uploadFile';
import { correctKnowledge } from '@/services/myKnowledge/errorCorrection';
import ImgUpload from '@/components/ImgUpload/index.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const { id } = toRefs(props);

const useForm = Form.useForm;

const layout = reactive({
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
});

const modelRef = reactive<CorrecteFormState>({
  content: '',
  picture: [],
  accessory: [],
});

const rulesRef = reactive({
  content: [
    {
      required: true,
      message: '请选择纠错内容！',
    },
  ],
  picture: [
    {
      required: false,
    },
  ],
  accessory: [
    {
      required: false,
    },
  ],
});

const handleChange = ({ file }: UploadChangeParam<UploadFile<any>>) => {
  if (!file.status) {
    const index = modelRef.accessory.indexOf(file);
    const newFileList = modelRef.accessory.slice();
    newFileList.splice(index, 1);
    modelRef.accessory = newFileList;
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
      modelRef.accessory[modelRef.accessory.length - 1].thumbUrl = res;
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
      const targetIndex = modelRef.accessory.indexOf(file);
      modelRef.accessory.splice(targetIndex, 1);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
  return false;
};

const genParams = ({
  content,
  picture,
  accessory,
}: {
  content: string;
  picture: UploadFile<string>[];
  accessory: UploadFile<string>[];
}) => {
  return {
    knowledgeId: id.value,
    content,
    picture: picture
      .map((item) => {
        return item.response;
      })
      .join(','),
    accessory: accessory
      .map((item) => {
        return item.response;
      })
      .join(','),
  };
};

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const handleSubmit = async () => {
  try {
    const formState = await validate();
    const parmas = genParams(formState);
    await correctKnowledge(parmas);
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
