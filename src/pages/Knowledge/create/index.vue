<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}知识</div>
    <a-form class="mt24" :label-col="{ span: 2 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="知识类型" v-bind="validateInfos.type">
        <a-radio-group v-model:value="modelRef.type">
          <a-radio-button value="0">文档</a-radio-button>
          <a-radio-button value="1">图片</a-radio-button>
          <a-radio-button value="2">视频</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :label="fileType[modelRef.type as keyof typeof fileType]"
        v-bind="validateInfos.file"
      >
        <ImgUpload v-model="modelRef.file" :max-length="8" />
      </a-form-item>
      <a-form-item label="知识条目" v-bind="validateInfos.doc_number">
        <a-input v-model:value="modelRef.doc_number" placeholder="请填写知识条目" />
      </a-form-item>
      <a-form-item label="知识分类" v-bind="validateInfos.category">
        <a-input v-model:value="modelRef.category" placeholder="请选择知识分类" />
      </a-form-item>
      <template v-if="modelRef.type === '0'">
        <a-form-item label="文号" v-bind="validateInfos.category">
          <a-input v-model:value="modelRef.category" placeholder="请填写文号" />
        </a-form-item>
        <a-form-item label="档案日期" v-bind="validateInfos.file_date">
          <a-date-picker v-model:value="modelRef.file_date" />
        </a-form-item>
        <a-form-item label="页数" v-bind="validateInfos.pages_num">
          <a-input v-model:value="modelRef.pages_num" placeholder="请填写页数" />
        </a-form-item>
        <a-form-item label="存放地点" v-bind="validateInfos.storage_location">
          <a-input v-model:value="modelRef.storage_location" placeholder="请填写存放地点" />
        </a-form-item>
      </template>

      <a-form-item label="知识内容" v-bind="validateInfos.content">
        <froala :tag="'textarea'" :config="froalaConfig" v-model:value="modelRef.content"></froala>
      </a-form-item>

      <a-row v-if="type !== 'readonly'">
        <a-divider />
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
          <a-button style="margin-left: 10px" @click="handleCancle">取消</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import ImgUpload from '@/components/ImgUpload/index.vue';

const froalaConfig = {
  events: {
    'froalaEditor.initialized': function () {
      console.log('initialized');
    },
  },
};

type PageType = 'update' | 'create';

const route = useRoute();
const router = useRouter();

const { type = 'create', id = '' } = route.query;

enum pageType {
  update = '编辑',
  create = '新增',
}

const fileType = {
  '0': '文档',
  '1': '图片',
  '2': '视频',
};

const useForm = Form.useForm;

const modelRef = reactive({
  type: '0',
  file: [],
  entry: '',
  category: '',
  doc_number: '',
  file_date: '',
  pages_num: '',
  storage_location: '',
  content: '',
});

const rulesRef = computed(() => ({
  type: [
    {
      required: true,
      message: '请选择知识类型',
    },
  ],
  file: [
    {
      required: modelRef.type !== '0',
      message: '请上传文件',
    },
  ],
  entry: [
    {
      required: true,
      message: '请填写知识条目',
    },
  ],
  category: [
    {
      required: false,
    },
  ],
  doc_number: [
    {
      required: false,
    },
  ],
  file_date: [
    {
      required: false,
    },
  ],
  pages_num: [
    {
      required: false,
    },
  ],
  storage_location: [
    {
      required: false,
    },
  ],
  content: [
    {
      required: false,
    },
  ],
}));

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const onSubmit = async () => {
  try {
    const formState = await validate();
    console.log('🚀 ~ file: index.vue ~ line 85 ~ onSubmit ~ formState', formState);
  } catch (error) {
    console.log(error);
  }
};

const handleCancle = () => {
  resetFields();
  router.back();
};
</script>

<style lang="less" scoped>
.page-title {
  color: #000000d9;
  font-size: 24px;
}
.ckeditor :deep(.ck-editor__editable_inline) {
  min-height: 200px;
}
</style>
