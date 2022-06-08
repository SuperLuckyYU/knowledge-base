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
      <a-form-item :label="fileType[modelRef.type as keyof typeof fileType]" v-bind="validateInfos.file">
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
        <BaseEditor v-model="modelRef.content" />
      </a-form-item>
      <a-form-item label="设置标签" v-bind="validateInfos.label">
        <a-select v-model:value="modelRef.label" mode="multiple" :options="labelOptions" placeholder="请选择标签">
          <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0" />
            <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()"
              @click="handleCreateLabel">
              <plus-outlined />
              新增
            </div>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="安全级别" v-bind="validateInfos.safe_level">
        <a-radio-group v-model:value="modelRef.safe_level" :options="safeLevelOptions" />
      </a-form-item>
      <a-form-item label="有效期" v-bind="validateInfos.expiration_type">
        <a-radio-group v-model:value="modelRef.expiration_type">
          <a-radio value="0">永久有效</a-radio>
          <a-radio value="1">自定义有效期</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 2 }" v-bind="validateInfos.expiration_date"
        v-if="modelRef.expiration_type === '1'">
        <a-date-picker v-model:value="modelRef.expiration_date" />
      </a-form-item>
      <a-form-item label="所属项目" v-bind="validateInfos.project">
        <a-select v-model:value="modelRef.project" :options="projectOptions" placeholder="请选择项目">
        </a-select>
      </a-form-item>
      <a-form-item label="定位" v-bind="validateInfos.location" :wrapperCol="{ span: 6 }">
        <a-row>
          <a-col :span="20" class="mr15">
            <a-input v-model:value="modelRef.location" />
          </a-col>
          <a-col :span="1">
            <a-button type="primary" @click="handleChooseLocation">
              选择定位
              <template #icon>
                <environment-outlined />
              </template>
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="关联知识" v-bind="validateInfos.knowledge">
        <div>
          <a-button class="mr15" type="primary" @click="LinkKnowledgeState.visible = true">关联知识</a-button>
          <span>已关联 {{ LinkKnowledgeState.knowledgeList.length }} 条知识</span>
        </div>
        <select-knowledge-table class="mt24" rowKey="id" :data-source="LinkKnowledgeState.knowledgeList"
          :pagination="false" bordered>
          <template #operation="{ record }">
            <a-button type="primary" size="small" @click="handleRemoveKnowledge(record)">移除</a-button>
          </template>
        </select-knowledge-table>
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
  <create-label-dialog v-if="CreateLabelDialogState.visible" type="create" :info="({} as LabelItemType)"
    @success="fetchLabelList" @cancel="handleCancelLabelCreateDialog" />
  <location-dialog v-if="LocationDialogState.visible" v-model="modelRef.location"
    @cancel="handleCancelLocationDialog" />
  <select-knowledge-dialog v-if="LinkKnowledgeState.visible" @success="handleKnowledgeSelected"
    @cancel="LinkKnowledgeState.visible = false" />
</template>

<script lang="ts" setup>
import type { SetupContext } from 'vue';
import type { LabelItemType } from '@/services/systemSetter/label';
import type { KnowledgeItemType } from '@/types/myKnowledge/knowledge';
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import useFormState from '../composables/useFormState';
import ImgUpload from '@/components/ImgUpload/index.vue';
import BaseEditor from '@/components/BaseEditor/index.vue';
import CreateLabelDialog from '../../Label/sections/CreateDialog.vue';
import LocationDialog from '../sections/LocationDialog.vue';
import SelectKnowledgeDialog from '../sections/SelectKnowledgeDialog.vue';
import SelectKnowledgeTable from '../sections/SelectKnowledgeTable.vue';

const VNodes = (_: unknown, { attrs }: SetupContext) => {
  return attrs.vnodes;
}

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

const safeLevelOptions = [
  { label: '水务局内部公开', value: '0' },
  { label: '同科室公开', value: '1' },
  { label: '项目组公开', value: '2' },
  { label: '私有', value: '3' },
]

const useForm = Form.useForm;

const { modelRef, rulesRef } = useFormState();

const labelOptions = reactive([{
  label: '水行政',
  value: '1'
}, {
  label: '水务志',
  value: '2'
}]);

const fetchLabelList = () => { }

const CreateLabelDialogState = reactive({
  visible: false
})

const handleCreateLabel = () => {
  CreateLabelDialogState.visible = true
}

const handleCancelLabelCreateDialog = () => {
  CreateLabelDialogState.visible = false
}

const LocationDialogState = reactive({
  visible: false
})

const handleChooseLocation = () => {
  LocationDialogState.visible = true
}

const handleCancelLocationDialog = () => {
  LocationDialogState.visible = false
}

const LinkKnowledgeState = reactive<{ visible: boolean; knowledgeList: KnowledgeItemType[] }>({
  visible: false,
  knowledgeList: []
});

const handleKnowledgeSelected = (data: { selectedRows: KnowledgeItemType[] }) => {
  const { selectedRows } = data
  LinkKnowledgeState.knowledgeList.push(...selectedRows)

}

const handleRemoveKnowledge = (row: KnowledgeItemType) => {
  LinkKnowledgeState.knowledgeList.splice(LinkKnowledgeState.knowledgeList.findIndex(item => item.id == row.id), 1)
}

const projectOptions = reactive([])

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
