<!-- 创建&更新角色弹窗 -->
<template>
  <a-modal
    :visible="true"
    :title="type === 'create' ? '新建角色' : '更新角色'"
    :closable="false"
    width="600px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-form v-bind="layout">
      <a-form-item label="角色名称" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" placeholder="请输入角色名称"></a-input>
      </a-form-item>
      <a-form-item label="角色描述" v-bind="validateInfos.desc">
        <a-textarea v-model:value="modelRef.desc" :rows="4" :maxlength="6" />
      </a-form-item>
      <a-form-item label="菜单列表" v-bind="validateInfos.menu">
        <a-tree v-model:checkedKeys="modelRef.menu" checkable :tree-data="menuData"> </a-tree>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { RoleItemType } from '@/services/systemSetter/role';
import { reactive } from 'vue';
import { message, Form } from 'ant-design-vue';

interface Props {
  type: 'create' | 'update';
  info?: RoleItemType;
}

interface FormState {
  name: string;
  desc?: string;
  menu: string[];
}

const props = defineProps<Props>();
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
  name: '',
  desc: '',
  menu: [],
});

const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请填写角色名称！',
    },
  ],
  desc: [
    {
      required: false,
    },
  ],
  menu: [
    {
      required: true,
      message: '请选择菜单项！',
    },
  ],
});

const menuData = reactive([
  {
    title: '知识库',
    key: '0-0',
    children: [
      {
        title: '知识首页',
        key: '0-0-0',
        children: [
          { title: '查看', key: '0-0-0-0' },
          { title: '编辑', key: '0-0-0-1' },
        ],
      },
      {
        title: '知识地图',
        key: '0-0-1',
        children: [
          { title: '查看', key: '0-0-1-0' },
          { title: '编辑', key: '0-0-1-1' },
        ],
      },
      {
        title: '我的',
        key: '0-0-2',
        children: [
          {
            title: '我的知识',
            key: '0-0-2-0',
            children: [
              { title: '查看', key: '0-0-2-0-0' },
              { title: '编辑', key: '0-0-2-0-1' },
            ],
          },
          {
            title: '我的收藏',
            key: '0-0-2-1',
            children: [
              { title: '查看', key: '0-0-2-1-0' },
              { title: '编辑', key: '0-0-2-1-1' },
            ],
          },
          {
            title: '我的纠错',
            key: '0-0-2-2',
            children: [
              { title: '查看', key: '0-0-2-2-0' },
              { title: '编辑', key: '0-0-2-2-1' },
            ],
          },
          {
            title: '知识归档',
            key: '0-0-2-3',
            children: [
              { title: '查看', key: '0-0-2-3-0' },
              { title: '编辑', key: '0-0-2-3-1' },
            ],
          },
        ],
      },
      {
        title: '统计报表',
        key: '0-0-3',
        children: [
          { title: '查看', key: '0-0-3-0' },
          { title: '编辑', key: '0-0-3-1' },
        ],
      },
      {
        title: '系统管理',
        key: '0-0-4',
        children: [
          { title: '查看', key: '0-0-4-0' },
          { title: '编辑', key: '0-0-4-1' },
        ],
      },
    ],
  },
]);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleSubmit = async () => {
  try {
    const params = await validate();
    console.log('🚀 ~ file: CreateRoleDialog.vue ~ line 74 ~ handleSubmit ~ params', params);
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
