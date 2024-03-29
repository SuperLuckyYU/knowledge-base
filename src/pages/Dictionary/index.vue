<template>
  <div>
    <a-card class="search-box-wrap mt15">
      <a-tabs
        v-model:activeKey="formState.status"
        type="card"
        :tabBarGutter="6"
        class="search-tabs"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="item in CATEGORY_OPTIONS"
          :key="item.value"
          :tab="item.label"
        ></a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card class="table-box mt20">
      <a-row class="action-btn-box" v-if="formState.status === '1'">
        <a-button
          style="background-color: #36bc62; border-color: #36bc62"
          type="primary"
          @click="append('create')"
          >新建</a-button
        >
      </a-row>
      <el-empty v-if="!dataSource.length" :image-size="200" description="暂无数据" />
      <el-tree
        v-else
        :data="dataSource"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :props="{ label: 'dictName' }"
      >
        <template #default="{ node, data }" v-if="formState.status === '1'">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <plus-square-outlined @click="append('create', data)" class="mr5" />
              <edit-outlined @click="append('update', data)" class="mr5" />
              <a-popconfirm
                title="确定要删除该节点吗?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="remove(node, data)"
                @cancel="() => {}"
              >
                <minus-square-outlined />
              </a-popconfirm>
            </span>
          </span>
        </template>
      </el-tree>
    </a-card>
    <create-dialog
      v-if="CreateDialogState.visible"
      :type="CreateDialogState.type"
      :category="CreateDialogState.category"
      :id="CreateDialogState.id"
      :name="CreateDialogState.name"
      @success=""
      @cancel="handleCancelCreateDialog"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Dictionary',
};
</script>
<script lang="ts" setup>
import type { Tree } from '@/types/systemSetter/dictionary';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { ref, reactive } from 'vue';
import { CATEGORY_OPTIONS } from '@/constants/dictionary';
import { PlusSquareOutlined, MinusSquareOutlined, EditOutlined } from '@ant-design/icons-vue';
import { ElTree, ElEmpty } from 'element-plus';
import { getDictionaryList, delDictionary } from '@/services/systemSetter/dictionary';
import type {
  DictionaryReturnProps,
  DictionaryListProps,
} from '@/services/systemSetter/dictionary';
import CreateDialog from './sections/Create.vue';
import { message } from 'ant-design-vue';

interface ModelStateType {
  visible: boolean;
  id: string;
  type: 'create' | 'update';
  category: string;
  name: string;
}

const formState = reactive({
  status: '1',
});

const dataSource = ref<DictionaryReturnProps>([]);

const fetchData = async () => {
  const res = await getDictionaryList({
    type: formState.status,
  });
  dataSource.value = res as unknown as DictionaryReturnProps;
};

fetchData();

const handleTabChange = () => {
  fetchData();
};

const CreateDialogState = reactive<ModelStateType>({
  visible: false,
  id: '',
  type: 'create',
  category: '0',
  name: '',
});

const append = (type: 'create' | 'update', data?: Tree) => {
  const newValue = {
    visible: true,
    id: data?.id ?? '',
    type: type,
    category: formState.status,
    name: type === 'update' ? data && data['dictName' as keyof typeof data] : '',
  };
  Object.assign(CreateDialogState, newValue);
  fetchData();
};

const remove = async (node: Node, data: Tree) => {
  await delDictionary({ id: data.id + '' });
  message.success('删除成功！');
  fetchData();
};

const handleCancelCreateDialog = () => {
  CreateDialogState.visible = false;
  fetchData();
};
</script>

<style lang="less">
.search-box-wrap {
  .ant-card-body {
    padding: 15px;
  }
}
.search-tabs {
  border: none;
  .ant-tabs-nav {
    margin: 0 !important;
  }
  .ant-tabs-top > .ant-tabs-nav::before {
    border-color: #ffffff;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
