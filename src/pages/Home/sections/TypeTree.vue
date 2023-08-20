<template>
  <div>
    <a-card class="table-box mt20">
      <a-tabs
        v-model:activeKey="formState.status"
        type="card"
        :tabBarGutter="6"
        class="search-tabs mb15"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="item in CATEGORY_OPTIONS"
          :key="item.value"
          :tab="item.label"
        ></a-tab-pane>
      </a-tabs>
      <el-empty v-if="!dataSource.length" :image-size="200" description="暂无数据" />
      <el-tree
        v-else
        :data="dataSource"
        node-key="id"
        check-on-click-node
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        :default-checked-keys="[]"
        :props="{ label: 'dictName' }"
        @node-click="handleCheckNode"
      >
        <template v-slot="{ node, data }">
          <span :data-type="data">{{ `${data.dictName}(${data.knowledgeNum})` }}</span>
        </template>
      </el-tree>
    </a-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TypeTree',
};
</script>
<script lang="ts" setup>
import type { DictionaryReturnProps } from '@/services/systemSetter/dictionary';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { ref, reactive, toRefs, toRaw } from 'vue';
import { CATEGORY_OPTIONS } from '@/constants/dictionary';
import { ElTree, ElEmpty } from 'element-plus';
import { getDictionaryList, getDictionaryTotal } from '@/services/systemSetter/dictionary';

interface Props {
  knowledgeType: string;
  knowledgeFlag: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:knowledgeType', 'update:knowledgeFlag', 'change']);

const formState = reactive({
  status: '1',
});

const { knowledgeType, knowledgeFlag } = toRefs(props);

const checkedKey = ref('');

const dataSource = ref<DictionaryReturnProps>([]);

const fetchData = async () => {
  const res = await getDictionaryList({
    type: formState.status,
  });
  const total = await getDictionaryTotal();
  dataSource.value = res as unknown as DictionaryReturnProps;
  dataSource.value.unshift({ dictName: '全部', knowledgeNum: total, id: '', parentId: '' });
};

fetchData();

const handleTabChange = () => {
  fetchData();
  emit('update:knowledgeType', '');
  emit('update:knowledgeFlag', '');
};

const handleCheckNode = (node: Node) => {
  checkedKey.value = node.id.toString();
  if (formState.status === '1') {
    emit('update:knowledgeType', toRaw(node.id));
    emit('update:knowledgeFlag', '');
  } else {
    emit('update:knowledgeType', '');
    emit('update:knowledgeFlag', toRaw(node.id));
  }
  emit('change', toRaw(node.id));
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
