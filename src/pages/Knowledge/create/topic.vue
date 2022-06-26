<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}专题</div>
    <a-form class="mt24" :label-col="{ span: 2 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="专题标题" v-bind="validateInfos.knowledgeName">
        <a-input v-model:value="modelRef.knowledgeName" placeholder="请填写专题标题" />
      </a-form-item>
      <a-form-item label="分类" v-bind="validateInfos.knowledgeType">
        <a-tree-select
          v-model:value="modelRef.knowledgeType"
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
      <a-form-item label="专题描述" v-bind="validateInfos.content">
        <a-textarea
          v-model:value="modelRef.content"
          :rows="4"
          placeholder="请填写专题描述"
          :maxlength="6"
        />
      </a-form-item>
      <a-form-item label="设置标签" v-bind="validateInfos.labels">
        <knowledge-label v-model="modelRef.labels" />
      </a-form-item>
      <a-form-item label="安全级别" v-bind="validateInfos.securityLevel">
        <a-radio-group v-model:value="modelRef.securityLevel" :options="safeLevelOptions" />
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
          <a-button class="mr15" type="primary" @click="LinkKnowledgeState.visible = true"
            >关联知识</a-button
          >
          <span>已关联 {{ LinkKnowledgeState.knowledgeList.length }} 条知识</span>
        </div>
        <select-knowledge-table
          class="mt24"
          rowKey="id"
          :data-source="LinkKnowledgeState.knowledgeList"
          :pagination="false"
          bordered
        >
          <template #operation="{ record }">
            <a-button type="primary" size="small" @click="handleRemoveKnowledge(record)"
              >移除</a-button
            >
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
  <location-dialog
    v-if="LocationDialogState.visible"
    v-model="modelRef.location"
    @cancel="handleCancelLocationDialog"
  />
  <select-knowledge-dialog
    v-if="LinkKnowledgeState.visible"
    :selected-rows="LinkKnowledgeState.knowledgeList"
    @success="handleKnowledgeSelected"
    @cancel="LinkKnowledgeState.visible = false"
  />
</template>

<script lang="ts" setup>
import type { KnowledgeItemType, CreateTopicFormState } from '@/types/myKnowledge/knowledge';
import type {
  CreateMyKnowledgeProps,
  UpdateMyKnowledgeProps,
} from '@/services/myKnowledge/knowledge';
import type { DictionaryReturnProps } from '@/services/systemSetter/dictionary';
import { reactive, toRaw, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import {
  createMyKnowledge,
  updateMyKnowledge,
  getKnowledgeDetail,
} from '@/services/myKnowledge/knowledge';
import { getDictionaryList } from '@/services/systemSetter/dictionary';
import { removeNullItem } from '@/utils/utils';
import useCreateTopicFormState from '../composables/useCreateTopicFormState';
import KnowledgeLabel from '../sections/KnowledgeLabel.vue';
import LocationDialog from '../sections/LocationDialog.vue';
import SelectKnowledgeDialog from '../sections/SelectKnowledgeDialog.vue';
import SelectKnowledgeTable from '../sections/SelectKnowledgeTable.vue';

type PageType = 'update' | 'create';

const route = useRoute();
const router = useRouter();

const { type = 'create', id = '' } = route.query;

enum pageType {
  update = '编辑',
  create = '新增',
}

const safeLevelOptions = [
  { label: '水务局内部公开', value: '0' },
  { label: '同科室公开', value: '1' },
  { label: '项目组公开', value: '2' },
  { label: '私有', value: '3' },
];

const useForm = Form.useForm;

const { modelRef, rulesRef } = useCreateTopicFormState();

const updateVerision = ref('');

const fetchDetail = async () => {
  const res = await getKnowledgeDetail({ id: id as string });
  const {
    knowledgeName,
    knowledgeType,
    content,
    labels,
    securityLevel,
    longitude,
    latitude,
    relateds,
    version,
  } = res;
  modelRef.knowledgeName = knowledgeName;
  modelRef.knowledgeType = knowledgeType;
  modelRef.content = content;
  modelRef.labels = labels ?? [];
  modelRef.securityLevel = securityLevel ?? '0';
  modelRef.location = longitude || latitude ? longitude + ', ' + latitude : '';
  LinkKnowledgeState.knowledgeList = relateds;
  updateVerision.value = version;
};

onMounted(async () => {
  if (type === 'update') {
    await fetchDetail();
  }
});

const LocationDialogState = reactive({
  visible: false,
});

const handleChooseLocation = () => {
  LocationDialogState.visible = true;
};

const handleCancelLocationDialog = () => {
  LocationDialogState.visible = false;
};

const LinkKnowledgeState = reactive<{ visible: boolean; knowledgeList: KnowledgeItemType[] }>({
  visible: false,
  knowledgeList: [],
});

const handleKnowledgeSelected = (data: { selectedRows: KnowledgeItemType[] }) => {
  const { selectedRows } = data;
  LinkKnowledgeState.knowledgeList.push(...selectedRows);
};

const handleRemoveKnowledge = (row: KnowledgeItemType) => {
  LinkKnowledgeState.knowledgeList.splice(
    LinkKnowledgeState.knowledgeList.findIndex((item) => item.id == row.id),
    1,
  );
};

const categoryData = ref<DictionaryReturnProps>([]);

const fetchCategoryData = async () => {
  const res = await getDictionaryList({ type: '1' });
  categoryData.value = res;
};

fetchCategoryData();

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const genParams = (formState: CreateTopicFormState) => {
  const { knowledgeName, knowledgeType, content, labels, securityLevel, location } = formState;
  const locationArr = location ? location.split(', ') : [];
  const labelIds = toRaw(labels).join(',');
  const relateds = LinkKnowledgeState.knowledgeList
    .map((item: any) => {
      return item.id;
    })
    .join(',');
  const parmas = {
    knowledgeFlag: '3',
    knowledgeName,
    knowledgeType,
    content,
    labels: labelIds,
    securityLevel,
    longitude: locationArr.length && locationArr[0],
    latitude: locationArr.length && locationArr[1],
    relateds,
  };
  return removeNullItem(parmas);
};

const sendRequest = async (params: CreateMyKnowledgeProps | UpdateMyKnowledgeProps) => {
  if (type === 'create') {
    return await createMyKnowledge(params);
  }
  return await updateMyKnowledge({
    ...params,
    id: id as string,
    version: updateVerision.value,
  });
};

const onSubmit = async () => {
  try {
    const formState = await validate();
    const parmas = genParams(formState);
    await sendRequest(parmas);
    message.success('操作成功！');
    handleCancle();
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
