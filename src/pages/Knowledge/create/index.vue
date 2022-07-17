<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}知识</div>
    <a-form class="mt24" :label-col="{ span: 2 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="知识类型" v-bind="validateInfos.type">
        <a-radio-group v-model:value="modelRef.type" @change="handleTabChange">
          <a-radio-button value="2">文档</a-radio-button>
          <a-radio-button value="3">图片</a-radio-button>
          <a-radio-button value="4">视频</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :label="fileType[modelRef.type as keyof typeof fileType]"
        v-bind="validateInfos.file"
      >
        <ImgUpload v-model="modelRef.file" :max-length="8" :type="modelRef.type" />
      </a-form-item>
      <a-form-item label="知识条目" v-bind="validateInfos.entry">
        <a-input v-model:value="modelRef.entry" placeholder="请填写知识条目" />
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
      <template v-if="modelRef.type === '0'">
        <a-form-item label="文号" v-bind="validateInfos.doc_number">
          <a-input v-model:value="modelRef.doc_number" placeholder="请填写文号" />
        </a-form-item>
        <a-form-item label="档案日期" v-bind="validateInfos.file_date">
          <a-date-picker v-model:value="modelRef.file_date" valueFormat="YYYY-MM-DD" />
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
        <knowledge-label v-model="modelRef.label" type="create" />
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
      <a-form-item
        :wrapper-col="{ offset: 2 }"
        v-bind="validateInfos.expiration_date"
        v-if="modelRef.expiration_type === '1'"
      >
        <a-date-picker v-model:value="modelRef.expiration_date" valueFormat="YYYY-MM-DD" />
      </a-form-item>
      <!-- <a-form-item label="所属项目" v-bind="validateInfos.project">
        <a-select
          v-model:value="modelRef.project"
          :filter-option="false"
          :options="projectOptions"
          showSearch
          placeholder="请选择项目"
          @search="fetchProject"
        >
        </a-select>
      </a-form-item> -->
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
import type { KnowledgeItemType } from '@/types/myKnowledge/knowledge';
import type { DictionaryReturnProps } from '@/services/systemSetter/dictionary';
import type {
  CreateMyKnowledgeProps,
  UpdateMyKnowledgeProps,
} from '@/services/myKnowledge/knowledge';
import { debounce } from 'lodash-es';
import { reactive, ref, toRaw, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import useFormState from '../composables/useFormState';
import ImgUpload from '@/components/ImgUpload/index.vue';
import BaseEditor from '@/components/BaseEditor/index.vue';
import KnowledgeLabel from '../sections/KnowledgeLabel.vue';
import LocationDialog from '../sections/LocationDialog.vue';
import SelectKnowledgeDialog from '../sections/SelectKnowledgeDialog.vue';
import SelectKnowledgeTable from '../sections/SelectKnowledgeTable.vue';
import { getDictionaryList } from '@/services/systemSetter/dictionary';
// import { getProjectList } from '@/services/systemSetter/project';
import {
  createMyKnowledge,
  getKnowledgeDetail,
  updateMyKnowledge,
} from '@/services/myKnowledge/knowledge';
import { removeNullItem, mockImgUrl } from '@/utils/utils';
import { useUserStore } from '@/store/moudles/user';

type PageType = 'update' | 'create';

const route = useRoute();
const router = useRouter();

const { type = 'create', id = '' } = route.query;

const userStore = useUserStore();

enum pageType {
  update = '编辑',
  create = '新增',
}

const fileType = {
  '2': '文档',
  '3': '图片',
  '4': '视频',
};

const safeLevelOptions = [
  { label: '水务局内部公开', value: '0' },
  { label: '同科室公开', value: '1' },
  // { label: '项目组公开', value: '2' },
  { label: '私有', value: '3' },
];

const updateVerision = ref('');

const fetchDetail = async () => {
  const res = await getKnowledgeDetail({ id: id as string });
  const {
    knowledgeFlag,
    knowledgeName,
    knowledgeType,
    accessory,
    documentNum,
    archiveTime,
    pagination,
    location,
    content,
    labels,
    securityLevel,
    expirationType,
    endTime,
    // itemId,
    longitude,
    latitude,
    relateds,
    version,
  } = res;
  modelRef.entry = knowledgeName;
  modelRef.type = knowledgeFlag + '';
  modelRef.category = knowledgeType;
  modelRef.doc_number = documentNum;
  modelRef.file_date = archiveTime;
  modelRef.pages_num = pagination;
  modelRef.storage_location = location;
  modelRef.content = content;
  modelRef.label = labels.map((item) => {
    return item.id;
  });
  modelRef.safe_level = securityLevel ?? '0';
  modelRef.expiration_type = expirationType ?? '0';
  modelRef.expiration_date = endTime;
  // modelRef.project = itemId;
  modelRef.location = longitude || latitude ? longitude + ', ' + latitude : '';
  modelRef.file = mockImgUrl(accessory.split(','));
  LinkKnowledgeState.knowledgeList = relateds;
  updateVerision.value = version;
};

onMounted(async () => {
  if (type === 'update') {
    await fetchDetail();
  }
});

const useForm = Form.useForm;

let { modelRef, rulesRef } = useFormState();

const handleTabChange = () => {
  modelRef.file = [];
};

const categoryData = ref<DictionaryReturnProps>([]);

const fetchCategoryData = async () => {
  const res = await getDictionaryList({ type: '1' });
  categoryData.value = res;
};

fetchCategoryData();

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

// const projectOptions = ref<{ label: string; value: string }[]>([]);

// const fetchProjectList = async (name?: string) => {
//   const data: Record<string, any> = {};
//   if (name) data['itemName'] = name;
//   const { records } = await getProjectList(data);
//   projectOptions.value = records.map(({ itemName, id }) => ({
//     label: itemName,
//     value: id,
//   }));
// };

// const fetchProject = debounce((name: string) => {
//   fetchProjectList(name);
// }, 300);

// fetchProjectList();

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const genParmas = (formState: Record<string, any>) => {
  const {
    category,
    content,
    doc_number,
    entry,
    expiration_date,
    expiration_type,
    file,
    file_date,
    label,
    location,
    pages_num,
    // project,
    safe_level,
    storage_location,
    type,
  } = formState;
  const locationArr = location ? location.split(', ') : [];
  const labels = toRaw(label).join(',');
  const accessory = toRaw(file)
    .map((item: any) => {
      return item.response;
    })
    .join(',');
  const relateds = LinkKnowledgeState.knowledgeList
    .map((item: any) => {
      return item.id;
    })
    .join(',');
  const parmas = {
    knowledgeFlag: type,
    knowledgeName: entry,
    knowledgeType: category,
    accessory,
    documentNum: doc_number,
    archiveTime: file_date,
    pagination: pages_num,
    location: storage_location,
    content,
    labels,
    securityLevel: safe_level,
    endTime: expiration_date,
    // itemId: project,
    itemId: '',
    longitude: locationArr.length && locationArr[0],
    latitude: locationArr.length && locationArr[1],
    expirationType: expiration_type,
    relateds,
    userId: userStore.userInfo.id,
    parentUserId: userStore.userInfo.pUserId,
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
    const params = genParmas(formState);
    await sendRequest(params);
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
