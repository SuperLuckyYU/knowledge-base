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
        <a-tree
          v-model:checkedKeys="menuCheckedIds"
          checkable
          :tree-data="menuData"
          :fieldNames="{ children: 'children', title: 'menuName', key: 'id' }"
        >
        </a-tree>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import type { RoleItemType, MenuReturnProps } from '@/services/systemSetter/role';
import { ref, reactive, toRefs } from 'vue';
import { message, Form } from 'ant-design-vue';
import { getMenuTree, createRole, getRoleDetail, updateRole } from '@/services/systemSetter/role';

interface Props {
  type: 'create' | 'update';
  info?: RoleItemType;
}

interface FormState {
  name: string;
  desc?: string;
}

const props = defineProps<Props>();
const { type, info } = toRefs(props);
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
});

const menuCheckedIds = ref<string[]>([]);

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

const menuData = reactive<MenuReturnProps>([]);
const menuDataObj: Record<string, string> = {};

const fetchMeunData = async () => {
  const res = await getMenuTree();
  Object.assign(menuData, res);
  const fn = (data: MenuReturnProps) => {
    data.forEach(({ id, menuName, children }) => {
      menuDataObj[id as keyof typeof menuDataObj] = menuName;
      if (children && children.length) fn(children);
    });
  };
  fn(res);
};

fetchMeunData();

const fetchDetial = async () => {
  const { roleName, roleDesc, menuIds } = await getRoleDetail({ id: info?.value?.id ?? '' });
  modelRef.desc = roleDesc;
  modelRef.name = roleName;
  menuCheckedIds.value = menuIds ?? [];
};

if (type.value === 'update') {
  fetchDetial();
}

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const sendRequest = async (params: FormState) => {
  const { name, desc } = params;
  const menuNames: string[] = [];
  menuCheckedIds.value.forEach((item: string) => {
    if (menuDataObj[item] !== '可编辑' && menuDataObj[item] !== '仅查看')
      menuNames.push(menuDataObj[item]);
  });
  const menuIds = menuCheckedIds.value.map((item: string) => {
    return item;
  });

  const commonProps = {
    roleName: name,
    roleDesc: desc,
    menuIds: menuIds.join(','),
    roleModules: menuNames.join(','),
  };

  if (type.value === 'create') {
    return await createRole(commonProps);
  }
  const updataProps = {
    ...commonProps,
    id: info?.value?.id ?? '',
  };
  return await updateRole(updataProps);
};

const handleSubmit = async () => {
  try {
    const params = await validate();
    await sendRequest(params);
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
