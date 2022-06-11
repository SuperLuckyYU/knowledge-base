<template>
  <a-card>
    <a-row>
      <!-- 知识内容 -->
      <a-col :span="16">
        <a-row class="mb24">
          <a-col :span="12" class="title">海淀区水务局法定职责</a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <a-rate v-model:value="rateValue" allow-half />
            <span class="ant-rate-text">{{ rateValue }}分</span>
          </a-col>
          <a-col :span="12">
            <a-button type="link" class="mr10">收藏</a-button>
            <a-button type="link" class="mr10">分享</a-button>
            <a-button type="link" class="mr10">纠错</a-button>
            <a-button type="link">评价</a-button>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">分类: </span>
            <span class="value">法律法规~部门规章</span>
          </a-col>
          <a-col :span="12">
            <span class="label">安全级别: </span>
            <span class="value">海淀区水务局局内公开</span>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">有效时间: </span>
            <span class="value">2000.8.7-2025.7.9</span>
          </a-col>
          <a-col :span="12">
            <span class="label">修订版本: </span>
            <span class="value">1.3</span>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">创建人: </span>
            <span class="value">李元</span>
          </a-col>
          <a-col :span="12">
            <span class="label">创建时间: </span>
            <span class="value">2020-9-13 14:09</span>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">状态: </span>
            <span class="value">被退回</span>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">标签: </span>
            <span class="value">
              <a-tag class="mr10" color="blue">职责</a-tag>
              <a-tag class="mr10" color="blue">水务</a-tag>
            </span>
          </a-col>
        </a-row>
        <div class="mb15" v-html="'<h1>Hello World</h1>'"></div>
        <a-row class="mb15">
          <a-col :span="5">
            <span class="label">附件列表: </span>
          </a-col>
          <a-col :span="8">
            <div class="file">海淀区水务局法定职责调整.pdf</div>
            <div class="file">海淀区水务局法定职责调整.pdf</div>
          </a-col>
          <a-col :span="2">
            <a-button type="link">下载</a-button>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="5">
            <span class="label">相关知识: </span>
          </a-col>
          <a-col :span="19">
            <div class="file">2021年海淀区水务局法定职责调整</div>
            <div class="file">2021年海淀区水务局法定职责调整</div>
          </a-col>
        </a-row>
      </a-col>
      <!-- 基础信息 -->
      <a-col :span="8">
        <div class="user-info">
          <a-avatar :src="STATE.DEFAULT_AVATAR"></a-avatar>
          <div class="user-name">马燕</div>
          <div class="role">审核人员</div>
        </div>
        <el-divider />
        <div class="base-info mb24">
          <div class="title mb15">基本信息</div>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">科室</span></a-col>
            <a-col :span="12"><span class="value">知识管理部门</span></a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">性别</span></a-col>
            <a-col :span="12"><span class="value">女</span></a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">联系电话</span></a-col>
            <a-col :span="12"><span class="value">13809234589</span></a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">最后会话时间</span></a-col>
            <a-col :span="12"><span class="value">2019/04/13 15:21:45</span></a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">直接领导</span></a-col>
            <a-col :span="12"><span class="value">孙松岩</span></a-col>
          </a-row>
        </div>
        <div class="version">
          <div class="version-title">条目版本</div>
          <a-table :columns="columns" :data-source="[]" bordered> </a-table>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
<script lang="ts">
export default {
  name: 'ArticleDetail',
};
</script>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import appConfig from '@/config/app.config';
import { ElDivider } from 'element-plus';

const STATE = reactive({
  DEFAULT_AVATAR: appConfig.miscellaneous?.defaultAvatar,
});

const columns = [
  {
    title: '版本',
    dataIndex: 'version',
  },
  {
    title: '修订人',
    dataIndex: 'name',
  },
  {
    title: '修订内容',
    dataIndex: 'content',
  },
  {
    title: '修订时间',
    dataIndex: 'time',
  },
];

const rateValue = ref<number>(2.5);
</script>
<style lang="less" scoped>
.title {
  flex: auto;
  overflow: hidden;
  color: #000000d9;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.user-info {
  text-align: center;
}
.version-title {
  flex: auto;
  overflow: hidden;
  color: #000000d9;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
