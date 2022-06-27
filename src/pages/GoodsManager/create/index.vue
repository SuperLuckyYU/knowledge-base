<template>
  <a-card>
    <div class="page-title">{{ pageType[type as keyof typeof pageType] }}商品</div>
    <a-form>
      <div v-for="item in FORMDATA">
        <a-divider />
        <div class="group-title">
          {{ item.title }}
        </div>
        <a-row :gutter="24">
          <template v-if="type === 'edit' && item.title === '商品信息'">
            <a-col :span="8">
              <a-form-item label="商品编码">
                <a-input disabled v-model:value="modelRef.sku" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="商品名称" v-bind="validateInfos.name">
                <a-input v-model:value="modelRef.name" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </template>
          <template v-for="(field, key) in item.group" :key="key">
            <a-col :span="8">
              <BaseFormItem :field="(field as FieldType)" :type="(type as PageType)" :modelRef="modelRef"
                :fieldkey="key" :validateInfos="validateInfos"
                :disabled="enableEditFields.indexOf(key) === -1 && type === 'edit'" />
            </a-col>
          </template>
        </a-row>
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
</template>

<script lang="ts" setup>
import { toRaw, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { FORMDATA } from './constants';
import { createGoods, editGoods, getProductInfo } from '@/services/goods';
import type { GoodsItemType } from '@/services/goods';
import type { FieldType } from '@/components/BaseFormItem/index.vue'
import { getImgOgriginUrl, mockImgUrl, formatEnum } from '@/utils/utils';
import useFormItemColumns from '@/composables/useFormItemColumns';
import BaseFormItem from '@/components/BaseFormItem/index.vue';

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
const enableEditFields = reactive(['name', 'tag_amount', 'cost_amount', 'cover_img_url', 'clothes_img_urls', 'thumbnail_url', 'screenshot_url']);

const useForm = Form.useForm;

const { modelRef, rulesRef } = useFormItemColumns(FORMDATA);
if (type === 'edit') {
  rulesRef['name'] = [
    {
      required: true,
      message: '请填写商品名称',
    },
  ]
}
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

const genInfoResult = () => {
  modelRef.tag_amount = modelRef.tag_amount / 100;
  modelRef.cost_amount = modelRef.cost_amount / 100;
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

if (type !== 'create' && sku) {
  fetchProductInfo();
}

const sendRequest = (params: GoodsItemType) => {
  const _params = cloneDeep(params);
  genImageData(_params, ['cover_img_url', 'thumbnail_url', 'screenshot_url'], 'text');
  genImageData(_params, ['clothes_img_urls'], 'textArray');
  _params.tag_amount = _params.tag_amount * 100;
  _params.cost_amount = _params.cost_amount * 100;
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
  return createGoods(_params);
}

const onSubmit = async () => {
  try {
    await validate();
    const params = toRaw((modelRef as GoodsItemType));
    const res = await sendRequest(params);
    if (res['code' as keyof typeof res] === 0) {
      message.success(`成功`);
      handleCancle();
      return
    }
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
