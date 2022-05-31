<template>
  <div>
    <a-card class="search-box-wrap mt15">
      <a-tabs v-model:activeKey="formState.status" type="card" :tabBarGutter="6" class="search-tabs">
        <a-tab-pane v-for="item in SUIT_STATUS_OPTIONS" :key="item.value" :tab="item.label"></a-tab-pane>
      </a-tabs>
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
              <a-form-item label="套装名称" name="sku">
                <a-input v-model:value.trim="formState.sku" placeholder="请输入套装名称" autocomplete="off" allow-clear />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="创建人" name="name">
                <a-input v-model:value.trim="formState.name" placeholder="请输入创建人" autocomplete="off" allow-clear />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="保存时间" name="date">
                <a-range-picker v-model:value="formState.date" :format="dateFormat" allow-clear
                  @change="handleChange" />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="上架时间" name="date">
                <a-range-picker v-model:value="formState.date" :format="dateFormat" allow-clear
                  @change="handleChange" />
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item>
                <a-space :size="20">
                  <a-button type="primary" @click="onSearch">查询</a-button>
                  <a-button @click="onReset">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-card>
    <a-card class="table-box mt20">
      <a-row class="action-btn-box" justify="space-between">
        <a-col></a-col>
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleOperateGoods({ sku: '' }, 'create')">新建套装</a-button>
            <a-button type="primary" @click="handlebatch(batchButton.value)">{{batchButton.text}}</a-button>
            <a-button type="primary" @click="selectGoodsModal.visible=true">新建</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table rowKey="id" :columns="columns" :row-selection="rowSelection" :data-source="dataSource" :pagination="pagination" bordered
        @change="onTableChange">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'edit')">编辑</a-button>
            <a-button type="link" class="action-btn" @click="handleDelete(record)">删除</a-button>
            <a-button type="link" class="action-btn" @click="handleDelete(record)">确认</a-button>
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'copy')">复制</a-button>
            <a-button type="link" class="action-btn" @click="handleOperateGoods(record, 'readonly')">详情</a-button>
            <!-- <a-button type="link" class="action-btn" @click="handlePrint(record)">打印条形码</a-button> -->
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <select-goods-modal v-model:visible="selectGoodsModal.visible" :selectedSkus="selectedRowKeys" @success="handleGoodsSelected"></select-goods-modal>

</template>
<script lang="ts">
export default {
  name: 'MatchSuitList',
};
</script>
<script lang="ts" setup>
import { reactive, computed, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import useSearchTableList from '@/composables/useSearchTableList';
import { getProductList, deleteProduct } from '@/services/goods';
import dayjs, { Dayjs } from 'dayjs';
import { CATEGORY_OPTIONS } from '@/constants/index';
import { SUIT_STATUS_OPTIONS } from '@/constants/matchSuit';
import { FormStateType } from '@/types/matchSuit/matchSuit';
import SelectGoodsModal from './components/SelectGoodsModal.vue'

const router = useRouter();
const columns = computed(() => {
  const sorted = sortedInfo.value || {};
  const status = formState.status
  const baseColumns = [
    {
      title: '套装ID',
      dataIndex: 'sku',
      key: 'sku',
      align: 'center',
      width: 120,
    },
    {
      title: '套装名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '商品数量',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'colour_code',
      key: 'colour_code',
      align: 'center',

    },
    {
      title: '上次保存时间',
      dataIndex: 'size_code',
      key: 'size_code',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'size_code' && sorted.order,
      status: ['0', '1']

    },
    {
      title: '上架时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'update_time' && sorted.order,
      status: ['2']
    }, {
      title: '下架时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      sorter: true,
      sortOrder: sorted.columnKey === 'update_time' && sorted.order,
      status: ['3']
    },
    {
      title: '下架原因',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      status: ['3']

    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ]

  return baseColumns.filter(ele => {
    const s = ele?.status
    if (!s || s.includes(status)) {
      return ele
    }
  })
});

const dateFormat = 'YYYY-MM-DD';

const formState: UnwrapRef<FormStateType> = reactive({
  sku: '',
  name: '',
  category: [],
  status: '0',
  // date: [dayjs().subtract(60, 'day'), dayjs()],
  date: null,
});

// 商品弹窗
const selectGoodsModal = reactive({
  visible: false,
  skus: []
});

const handleGoodsSelected = (data)=> {
  console.log(data)
  const {selectedRowSkus, selectedRows} = data
  selectGoodsModal.skus.push(selectedRowSkus)
  // selectGoods.goods.push(selectedRows)
}

const handleChange = (val: [Dayjs, Dayjs], dateStrings: []) => {
  console.log(val, dateStrings);
};

// 获取数据
const {
  onSearch,
  onReset,
  pagination,
  dataSource,
  getList,
  searchFormRef,
  onTableChange,
  sortedInfo,
  rowSelection,
  selectedRowKeys
} = useSearchTableList({
  fetchData: getProductList,
  formatParams() {
    const data: Record<string, any> = { ...formState };
    data.start_time = data.date && data.date[0].format(dateFormat);
    data.end_time = data.date && data.date[1].format(dateFormat);
    delete data['date'];
    return data;
  },
  listFormatEnum: true
});

const batchButton  = computed(()=> {
  const status = formState.status
  const obj = {
    '0': {
      text: '批量确认',
      value: '0'
    },
    '1': {
      text: '批量上架',
      value: '1'
    },
    '2': {
      text: '批量下架',
      value: '2'
    },
    '3': {
      text: '批量上架',
      value: '3'
    },
  }
  return obj[status]
})

const handlebatch = async(v)=> {
  if(!selectedRowKeys.value.length) {
    message.error('请选择套装');
    return
  }
  const data = {
    id: selectedRowKeys.value.join(',')
  }
  if(v == '0' || v =='1') {
    await deleteProduct(data);
  }
  if(v == '2') {
    await deleteProduct(data);
  }
  if(v == '3') {
    await deleteProduct(data);
  }
  message.success('操作成功');
  getList();
}

// 删除商品
const handleDelete = ({ id }: { id: string }) => {
  Modal.confirm({
    title: '删除后将无法恢复，您确定要删除该套装吗',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      const { code, msg } = await deleteProduct({ id: id });
      if (code === 0) {
        message.success('删除成功');
        getList();
      } else {
        message.error(msg);
      }
    },
    onCancel() {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  });
};

// 商品复制，编辑，查看
const handleOperateGoods = (record: { sku: string }, type: string) => {
  router.push({
    name: 'SuitCreate',
    query: record.sku
      ? {
        sku: record.sku,
        type: type,
      }
      : {
        type: type,
      },
  });
};

</script>

<style lang="less" scoped>
.cover-img-wrap {
  width: 50px;
}

.search-box {
  border: none;
  margin-bottom: 0
}

.action-btn {
  padding: 0 5px;
}
</style>

<style lang="less">
.search-box-wrap {
  .ant-card-body {
    padding: 15px
  }
}

.search-tabs {
  border: none;

  .ant-tabs-nav {
    margin: 0 !important;
  }

  .ant-tabs-top>.ant-tabs-nav::before {
    border-color: #ffffff
  }
}
</style>
