<!-- 选择商品弹窗 -->
<template>
  <a-modal title="选择商品" :visible="true" :maskClosable="false" :closable="false" width="70%" destroyOnClose
    :body-style="{ 'max-height': '900px', 'overflow-y': 'auto' }" @ok="handleSubmit" @cancel="onModalClose">
    <a-card class="search-box">
      <a-form ref="searchFormRef" layout="inline" :model="formState">
        <a-row :gutter="[24, 16]">
          <a-col>
            <a-form-item label="商品编码" name="sku">
              <a-input v-model:value.trim="formState.sku" placeholder="请输入商品编码" autocomplete="off" allow-clear />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品名称" name="name">
              <a-input v-model:value.trim="formState.name" placeholder="请输入商品名称" autocomplete="off" allow-clear />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="商品类目" name="category">
              <a-cascader style="min-width: 250px" v-model:value="formState.category" :options="CATEGORY_OPTIONS"
                placeholder="请选择商品类目" allow-clear />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-space :size="20">
                <a-button type="primary" @click="onSearch">查询</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <select-goods-table rowKey="id" :data-source="dataSource" :pagination="pagination" bordered @change="onTableChange">
      <template #operation="{ record }">
        <a-button :type="record.checked ? 'primary' : ''" :disabled="record.disabled" @click="handleChange(record)">{{
            record.checked ? '已添加' : '添加'
        }}</a-button>
      </template>
    </select-goods-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { reactive, computed, onMounted, toRefs, toRaw } from 'vue';
import { message, Modal } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList } from '@/services/goods';
import { CATEGORY_OPTIONS } from '@/constants/index';
import SelectGoodsTable from './SelectGoodsTable.vue'

const props = defineProps({
  // 已选择的商品sku
  selectedSkus: {
    type: Array,
    default: () => [],
  }
});

const { selectedSkus } = toRefs(props);

const emit = defineEmits(['success', 'cancel']);

const state = reactive({
  selectedRowSkus: [],
  selectedRow: []
})
const formState = reactive({
  sku: '',
  name: '',
  category: []
});

// 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  searchFormRef,
  onTableChange,
} = useSearchTableList({
  fetchData: getProductList,
  formatParams() {
    return formState;
  },
  listFormatEnum: true,
  pageSize: 10,
  formatResponse(res) {
    const { list, total_num } = res.result
    console.log(selectedSkus.value)
    list.map(item => {
      if (selectedSkus.value.length) {
        selectedSkus.value.find(i => item.checked = (item.sku == i))
        selectedSkus.value.find(i => item.disabled = (item.sku == i))
      }
      if (state.selectedRowSkus.length) {
        state.selectedRowSkus.find(i => item.checked = (item.sku == i))
      }
    })
    return {
      list: list,
      total: total_num
    }
  }
});

const handleChange = (row) => {
  row.checked = !row.checked
  if (row.checked) {
    state.selectedRowSkus.push(row.sku)
    state.selectedRow.push(row)
  } else {
    state.selectedRowSkus.splice(state.selectedRowSkus.findIndex(item => item == row.sku), 1)
    state.selectedRow.splice(state.selectedRowSkus.findIndex(item => item.sku == row.sku), 1)
  }
};

const handleSubmit = () => {
  const data = {
    selectedSkus: state.selectedRowSkus,
    selectedRows: state.selectedRow
  }
  emit('success', data);
  onModalClose()
}

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};

onMounted(async () => {
   await getList();
})
</script>
<style lang="less">
.select-goods-modal {
  .ant-modal-body {
    max-height: 500px;
  }
}
</style>