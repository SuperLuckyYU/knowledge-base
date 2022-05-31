import request, { get, post } from '@/utils/request';

type SerialNumType = number | string
export interface GoodsItemType {
  id?: string;
  name?: string;
  category: [SerialNumType, SerialNumType, SerialNumType, SerialNumType];
  material: string;
  style: string;
  silhouette?: string;
  waist_type?: string;
  collar_type?: string;
  clothes_detail?: string;
  length?: string;
  year: SerialNumType;
  season: SerialNumType;
  size_code: SerialNumType;
  colour_code: SerialNumType;
  unit: SerialNumType;
  tag_amount: number;
  cost_amount: number;
  supplier: string;
  cover_img_url: string;
  clothes_img_urls: string[];
  thumbnail_url: string;
  screenshot_url: string;
  sleeve_length?: string;
  stock_num: number;
}
export interface EditGoodsParamsType {
  id: string;
  name: string;
  tag_amount: number;
  cost_amount: number;
  cover_img_url: string;
  clothes_img_urls: string[];
  thumbnail_url: string;
  screenshot_url: string;
}

export interface UploadImageRequestResultType {
  animated: boolean;
  format: string;
  image_id: string;
  size: [number, number];
  url: string;
}

export type GoodsListProps = {
  sku?: string;
  name?: string;
  category?: [SerialNumType, SerialNumType, SerialNumType, SerialNumType];
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_value?: undefined | string;
  start_time?: string;
  end_time?: string;
}

export type GoodsListReturnProps = {
  list: [];
  num: number;
  page: number;
  page_size: number;
  total_num: number;
}
// 商品列表
export const getProductList = <GoodsListProps, GoodsListReturnProps>(data: GoodsListProps) => {
  return post<GoodsListReturnProps>('/Website/touch_open/product-list', data);
};

// 上传图片
export const uploadImg = (data: FormData) => {
  return post<UploadImageRequestResultType>('/Website/touch_open/image-upload', data, {
    headers: {
      'Content-type': 'multipart/form-data'
    },
  });
};

// 创建商品
export const createGoods = (data: GoodsItemType) => {
  return request({
    url: '/Website/touch_open/add-product',
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    data
  })
}
// 商品删除
export const deleteProduct = (data: { id: string }) => {
  return post('/Website/touch_open/delete-product', data);
};

// 修改商品
export const editGoods = (data: EditGoodsParamsType) => {
  return post<GoodsItemType>('/Website/touch_open/update-product', data, {
    headers: {
      'Content-type': 'application/json'
    }
  });
};

// 查询商品信息
export const getProductInfo = (sku: string) => {
  return get<GoodsItemType>('/Website/touch_open/product-detail', { sku });
}
