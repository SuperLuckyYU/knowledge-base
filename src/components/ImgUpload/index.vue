<template>
  <div class="upload-wrapper clearfix">
    <a-upload
      v-if="type === '2'"
      :multiple="true"
      v-model:file-list="fileList"
      :custom-request="customUpload"
      :before-upload="beforeUpload"
      @remove="handleRemoveCallBack"
      @change="handleChange"
      :disabled="disabled"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        点击上传
      </a-button>
    </a-upload>
    <a-upload
      v-else
      v-model:file-list="fileList"
      list-type="picture-card"
      :custom-request="customUpload"
      :before-upload="beforeUpload"
      @remove="handleRemoveCallBack"
      @preview="handlePreviewCallBack"
      @change="handleChange"
      :isImageUrl="
        () => {
          return true;
        }
      "
      :disabled="disabled"
    >
      <div v-if="fileList.length < maxLength">
        <plus-outlined class="upload-icon" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img v-if="previewImage" alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
  <a-modal
    title="裁剪图片"
    :visible="showImgCropper"
    :width="800"
    @ok="handleCropImg"
    @cancel="handleCancleCut"
  >
    <div style="width: 100%; height: 450px">
      <vue-cropper
        autoCrop
        :img="originImg"
        ref="cropper"
        centerBox
        fixed
        :canMove="false"
        :fixedNumber="[20, 13]"
      />
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import type { UploadFile, UploadChangeParam, FileType, UploadRequestOption } from './interface';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { ref, toRaw, watch, toRefs, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { UploadImage } from '@/utils/uploadFile';
import { cloneDeep } from 'lodash-es';
import { getBase64, genBase64ToFile } from '@/utils/utils';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { drawWaterMark } from '@/utils/utils';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  isAllowUpload: {
    type: Boolean,
    default: true,
  },
  maxLength: {
    type: Number,
    default: 100,
  },
  crop: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // 0 文档 1 图片 2视频
  type: {
    type: String,
    default: '0',
  },
});

const emit = defineEmits(['update:modelValue', 'onBeforeUpload']);

const { modelValue, crop } = toRefs(props);
const previewVisible = ref(false);
const previewImage = ref('');
const fileList = ref<any[]>([]);
const targetCropFile = ref({});
fileList.value = cloneDeep(modelValue.value);

// about crop image fields
const showImgCropper = ref(false);
const cropper = ref<InstanceType<typeof VueCropper>>(null);
const originImg = ref<string>('');
const currentFileName = ref<string>('');

// Actions
const handleCancel = () => {
  previewVisible.value = false;
  previewImage.value = '';
};

const handlePreviewCallBack = (file: UploadFile<any>) => {
  previewImage.value = file.thumbUrl as string;
  previewVisible.value = true;
};

const handleChange = ({ file }: UploadChangeParam<UploadFile<any>>) => {
  // tip: stateless or crop operations do not throw file value for now
  if (!file.status || crop.value) {
    if (crop.value) targetCropFile.value = file;
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  }
  if (file.status === 'removed') {
    emit('update:modelValue', toRaw(fileList.value));
  }
};

// Custom Upload
const beforeUpload = (file: FileType) => {
  emit('onBeforeUpload');

  if (!props.isAllowUpload) return false;

  const type = file.type.split('/')[0];
  const subType = file.type.split('/')[1];
  const isImage = type === 'image';
  const imgTypeList = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

  const isLt8M = file.size / 1024 / 1024 < 8;

  if (isImage && !isLt8M) {
    message.error('图片必须小于8MB！');
    return false;
  }

  // if (!isImage) {
  //   message.error('请上传图片类型的文件！');
  //   return false;
  // }

  if (isImage && imgTypeList.indexOf(subType) === -1) {
    message.error('文件格式错误，支持文件格式为：jpg、jpeg、png、gif、bmp');
    return false;
  }

  // 图片类型文件添加水印
  if (isImage && imgTypeList.indexOf(subType) > -1) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img: HTMLImageElement = document.createElement('img');
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const config = {
              font: 'microsoft yahei',
              textArray: ['北京市海淀区水务局'],
              density: 3,
            };
            drawWaterMark(ctx, img.naturalWidth, img.naturalHeight, config);
          }
          canvas.toBlob(resolve);
        };
      };
    });
  }

  return true;
};

const customUpload = async (
  { onSuccess, onError, file }: UploadRequestOption<any>,
  resend: boolean,
) => {
  // Whether to enable the clipping function
  if (crop.value && !resend) {
    currentFileName.value = (file as File).name;
    showImgCropper.value = true;
    const base64Str = await getBase64(file as File);
    originImg.value = base64Str as string;
    return;
  }
  const uploadImage = async (file: File) => {
    const res = await UploadImage(file);
    if (res) {
      onSuccess && onSuccess(res);
      // Tip：The file value is thrown here following the change operation described above
      if (crop.value) fileList.value.push(targetCropFile.value);
      // Tip：Compatible with picture preview on Safari browser
      fileList.value[fileList.value.length - 1].thumbUrl = res;
      // manual trigger
      if (resend) {
        fileList.value[fileList.value.length - 1].status = 'success';
        fileList.value[fileList.value.length - 1]['response'] = res;
      }
      emit('update:modelValue', toRaw(fileList.value));
    } else {
      const msg = '上传失败';
      onError && onError(msg as any);
      if (resend) fileList.value[fileList.value.length - 1].status = 'error';
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
      const targetIndex = fileList.value.indexOf(file);
      fileList.value.splice(targetIndex, 1);
      emit('update:modelValue', toRaw(fileList.value));
    },
    onCancel() {
      console.log('Cancel');
    },
  });
  return false;
};

// crop image
const handleCropImg = () => {
  cropper.value.getCropData((data: string) => {
    const file = genBase64ToFile(data, currentFileName.value);
    // Manually trigger the request again
    emit('update:modelValue', toRaw(fileList.value));
    customUpload({ file, action: '', method: 'POST' }, true);
  });
  showImgCropper.value = false;
};

const handleCancleCut = () => {
  showImgCropper.value = false;
  const lastLength = fileList.value.length - 1;
  const newFileList = fileList.value.slice();
  newFileList.splice(lastLength, 1);
  fileList.value = newFileList;
  emit('update:modelValue', newFileList);
};

watch(modelValue, (item) => {
  if (!toRaw(item).length) {
    fileList.value = [];
  } else {
    fileList.value = cloneDeep(item);
  }
});

const hasPendingTask = () => {
  return fileList.value.some((item) => {
    return item.status === 'uploading';
  });
};

defineExpose({
  hasPendingTask,
});
</script>
<style lang="less" scoped></style>
