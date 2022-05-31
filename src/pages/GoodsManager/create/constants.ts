import {
  CATEGORY_OPTIONS,
  MATERIAL_OPTIONS,
  STYLE_OPTIONS,
  SILHOUETTE_OPTIONS,
  WAIST_TYPE_OPTIONS,
  COLLAR_TYPE_OPTIONS,
  SLEEVE_LENGTH_OPTIONS,
  LENGTH_OPTIONS,
  YEAR_OPTIONS,
  SEASON_OPTIONS,
  SIZE_CODE_OPTIONS,
  COLOUR_CODE_OPTIONS,
  UNIT_OPTIONS,
} from '@/constants/index';

export const FORMDATA = [{
  title: '商品信息',
  group: {
    'category': {
      type: 'cascader',
      initValue: '',
      label: "商品类目",
      rules: [
        {
          required: true,
          message: '请选择商品类目',
        },
      ],
      options: CATEGORY_OPTIONS,
    },
    'material': {
      type: 'select',
      initValue: undefined,
      label: "材质",
      rules: [
        {
          required: true,
          message: '请选择材质',
        },
      ],
      options: MATERIAL_OPTIONS,
    },
    'style': {
      type: 'select',
      initValue: undefined,
      label: "风格",
      rules: [
        {
          required: true,
          message: '请选择风格',
        },
      ],
      options: STYLE_OPTIONS,
    },
    'silhouette': {
      type: 'select',
      initValue: undefined,
      label: "廓形",
      options: SILHOUETTE_OPTIONS,
    },
    'waist_type': {
      type: 'select',
      initValue: undefined,
      label: "腰型",
      options: WAIST_TYPE_OPTIONS,
    },
    'collar_type': {
      type: 'select',
      initValue: undefined,
      label: "领型",
      options: COLLAR_TYPE_OPTIONS,
    },
    'clothes_detail': {
      type: 'input',
      label: "细节",
      initValue: '',
    },
    'sleeve_length': {
      type: 'select',
      initValue: undefined,
      label: "袖长",
      options: SLEEVE_LENGTH_OPTIONS,
    },
    'length': {
      type: 'select',
      initValue: undefined,
      label: "长度",
      options: LENGTH_OPTIONS,
    },
    'year': {
      type: 'select',
      initValue: undefined,
      label: "年份",
      rules: [
        {
          required: true,
          message: '请选择年份',
        },
      ],
      options: YEAR_OPTIONS,
    },
    'season': {
      type: 'radio',
      initValue: undefined,
      label: "季节",
      rules: [
        {
          required: true,
          message: '请选择季节',
        },
      ],
      options: SEASON_OPTIONS,
    },
    'size_code': {
      type: 'radio',
      initValue: undefined,
      label: "尺码",
      rules: [
        {
          required: true,
          message: '请选择尺码',
        },
      ],
      options: SIZE_CODE_OPTIONS,
    },
    'colour_code': {
      type: 'select',
      initValue: undefined,
      label: "颜色",
      rules: [
        {
          required: true,
          message: '请选择颜色',
        },
      ],
      options: COLOUR_CODE_OPTIONS,
    },
    'unit': {
      type: 'radio',
      initValue: undefined,
      label: "单位",
      rules: [
        {
          required: true,
          message: '请选择单位',
        },
      ],
      options: UNIT_OPTIONS,
    },
    'stock_num': {
      type: 'input',
      initValue: '',
      label: "库存",
      rules: [
        {
          required: true,
          message: '请填写库存',
        },
      ],
    },
  }
}, {
  title: '商品价格',
  group: {
    'tag_amount': {
      type: 'number',
      initValue: '',
      label: "吊牌价",
      rules: [
        {
          required: true,
          message: '请填写吊牌价',
        },
      ]
    },
    "cost_amount": {
      type: 'number',
      initValue: '',
      label: "成本价",
      rules: [
        {
          required: true,
          message: '请填写成本价',
        },
      ]
    },
  },
}, {
  title: '商品图片',
  group: {
    'cover_img_url': {
      type: 'img-upload',
      initValue: [],
      label: "封面图",
      rules: [
        {
          required: true,
          message: '封面图必须上传且支持仅上传一张',
        },
      ]
    },
    'thumbnail_url': {
      type: 'img-upload',
      initValue: [],
      label: "缩略图",
      rules: [
        {
          required: true,
          message: '缩略图必须上传且支持仅上传一张',
        },
      ]
    },
    'clothes_img_urls': {
      type: 'img-upload',
      initValue: [],
      label: "细节图",
      maxCount: 3,
      rules: [
        {
          required: true,
          message: '细节图必须上传且支持至少一张，最多三张',
        },
      ]
    },
    'screenshot_url': {
      type: 'img-upload',
      initValue: [],
      label: "裁切图",
      crop: true,
      rules: [
        {
          required: true,
          message: '裁切图必须上传且支持仅上传一张',
        },
      ]
    },
  },
}, {
  title: '供应商信息',
  group: {
    'supplier': {
      type: 'input',
      initValue: '',
      label: "供应商",
      rules: [
        {
          required: true,
          message: '请填写供应商',
        },
      ]
    },
  },
}]
