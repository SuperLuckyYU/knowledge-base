<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}套装</div>
    <a-form>
      <div v-for="item in FORMDATA">
        <a-divider />
        <div class="group-title">
          {{ item.title }}
        </div>
        <template v-for="(field, key) in item.group" :key="key">
          <BaseFormItem :field="(field as FieldType)" :type="(type as PageType)" :modelRef="modelRef" :fieldkey="key"
            :validateInfos="validateInfos" />
        </template>
      </div>
      <div>
        <a-divider />
        <div class="group-title">
          套装商品
        </div>
        <div>
          <a-button type="primary" @click="selectGoodsModal.visible = true">添加商品</a-button>
          <span style="margin-left: 24px">已选 3 件商品</span>
        </div>
        <select-goods-table rowKey="id" :data-source="selectGoods.goods" :pagination="false" bordered>
          <template #operation="{ record }">
            <a-button type="primary" size="small" @click="handleRemoveGoods(record)">移除</a-button>
          </template>
        </select-goods-table>
      </div>
      <a-row v-if="type !== 'readonly'">
        <a-divider />
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
          <a-button style="margin-left: 10px" @click="handleCancle">取消</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <select-goods-modal v-if="selectGoodsModal.visible" :selectedSkus="selectGoods.skus" @success="handleGoodsSelected"
    @cancel="selectGoodsModal.visible = false" />
</template>

<script lang="ts" setup>
import type { GoodsItemType } from '@/services/goods';
import type { FieldType } from '@/components/BaseFormItem/index.vue';
import { toRaw, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { FORMDATA } from './constants';
import { createGoods, editGoods, getProductInfo } from '@/services/goods';
import { getImgOgriginUrl, mockImgUrl, formatEnum } from '@/utils/utils';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem from '@/components/BaseFormItem/index.vue';
import SelectGoodsTable from '../components/SelectGoodsTable.vue'
import SelectGoodsModal from '../components/SelectGoodsModal.vue'

type PageType = 'readonly' | 'edit' | 'create' | 'copy';

const route = useRoute();
const router = useRouter();
const { type = 'create', sku = '01013003611011' } = route.query;
enum pageType {
  edit = '编辑',
  create = '创建',
  readonly = '查看',
  copy = '复制'
}

const useForm = Form.useForm;

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA);
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

type FormatType = 'text' | 'textArray' | 'objectArray';

const genImageData = (target: any, fields: string[], targetType: FormatType) => {
  for (let index = 0; index < fields.length; index++) {
    const element = fields[index];
    if (targetType === 'text') {
      target[element] = getImgOgriginUrl(target[element])[0];
    }
    if (targetType === 'textArray') {
      target[element] = getImgOgriginUrl(target[element]);
    }
    if (targetType === 'objectArray') {
      target[element] = mockImgUrl(target[element]);
    }
  }
}

const genImgDescData = (target: any, fields: string[], targetType: 'text' | 'objectArray') => {
  type ImgDescItemType = {
    desc: string;
    img: any[];
  }
  for (let index = 0; index < fields.length; index++) {
    const element = fields[index];
    target[element].map((item: ImgDescItemType) => {
      if (targetType === 'text') {
      item.img = getImgOgriginUrl(item.img)[0] ?? '';
    }
    if (targetType === 'objectArray') {
      item.img = mockImgUrl(item.img) ?? [];
    }
    })

  }
}

const genInfoResult = () => {
  genImageData(modelRef, ['cover_img_url', 'thumbnail_url', 'clothes_img_urls', 'screenshot_url'], 'objectArray');
  if (type === 'readonly') formatEnum(modelRef)
}

const fetchProductInfo = async () => {
  const { result } = await getProductInfo(sku as string);
  if (result) {
    Object.assign(modelRef, result);
    genInfoResult();
  }
}
const selectGoods = reactive({
  skus: [],
  goods: []
})
// 商品弹窗
const selectGoodsModal = reactive({
  visible: false
});

const handleGoodsSelected = (data) => {
  const { selectedSkus, selectedRows } = data
  selectGoods.skus.push(...selectedSkus)
  selectGoods.goods.push(...selectedRows)
}

const handleRemoveGoods = (row) => {
  selectGoods.skus.splice(selectGoods.skus.findIndex(item => item == row.sku), 1)
  selectGoods.goods.splice(selectGoods.goods.findIndex(item => item.sku == row.sku), 1)
}

if (type !== 'create' && sku) {
  fetchProductInfo();
}

const sendRequest = (params: GoodsItemType) => {
  const _params = cloneDeep(params);
  genImageData(_params, ['cover_img_url'], 'text');
  genImageData(_params, ['sample_product_urls', 'model_img_urls'], 'textArray');
  genImgDescData(_params, ['curing_instruction', 'process_description', 'selection'], 'text');
  if (type === 'edit') {
    const {
      id,
      name,
      tag_amount,
      cost_amount,
      cover_img_url,
      clothes_img_urls,
      thumbnail_url,
      screenshot_url,
    } = _params;
    const data = {
      id: id as string,
      name: name as string,
      tag_amount,
      cost_amount,
      cover_img_url,
      clothes_img_urls,
      thumbnail_url,
      screenshot_url,
    }
    return editGoods(data);
  }
  console.log('====================================');
  console.log(_params);
  console.log('====================================');
  // return createGoods(_params);
}

const onSubmit = async () => {
  try {
    await validate();
    const params = toRaw((modelRef as GoodsItemType));
    const res = await sendRequest(params);
    // if (res['code' as keyof typeof res] === 0) {
    //   message.success(`成功`);
    //   handleCancle();
    //   return
    // }
  } catch (error) {
    console.log('error', error);
  }
};

const handleCancle = () => {
  resetFields();
  router.back()
}
</script>

<style lang='less' scoped>
.page-title {
  color: #000000d9;
  font-weight: 700;
  font-size: 24px;
}

.group-title {
  overflow: hidden;
  color: #000000d9;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}
</style>
