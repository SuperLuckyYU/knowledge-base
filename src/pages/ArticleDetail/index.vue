<template>
  <a-card>
    <a-row>
      <!-- 知识内容 -->
      <a-col :span="16">
        <a-row class="mb24">
          <a-col :span="24" class="title">{{ state.knowledgeName }}</a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <a-rate v-model:value="rateValue" allow-half disabled />
            <span class="ant-rate-text">{{ rateValue }}分</span>
          </a-col>
          <a-col :span="12">
            <a-button type="link" class="mr10" @click="handleCollecte">{{
              state.collectStatus === 1 ? '取消收藏' : '收藏'
            }}</a-button>
            <a-button
              type="link"
              class="mr10"
              @click="
                share({
                  id: id as string,
                  title: state.knowledgeName,
                  type: state.knowledgeFlag,
                  endTime: state.expirationType === '0' ? '永久有效' : state.endTime,
                })
              "
              >分享</a-button
            >
            <a-button type="link" class="mr10" @click="handleOpenCorrectDialog">纠错</a-button>
            <a-button type="link" @click="handleRate" :disabled="rateStatus">{{
              rateStatus ? '已评价' : '评价'
            }}</a-button>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">分类: </span>
            <span class="value">{{ state.knowledgeTypeName }}</span>
          </a-col>
          <a-col :span="12">
            <span class="label">安全级别: </span>
            <span class="value">{{ state.securityLevelName }}</span>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">创建人: </span>
            <span class="value">{{ state.creator }}</span>
          </a-col>
          <a-col :span="12">
            <span class="label">创建时间: </span>
            <span class="value">{{ state.createTime }}</span>
          </a-col>
        </a-row>
        <a-row class="mb15">
          <a-col :span="12">
            <span class="label">有效时间: </span>
            <span class="value">{{
              state.expirationType === '0' ? '永久有效' : state.endTime
            }}</span>
          </a-col>
        </a-row>
        <!-- <a-row class="mb15">
          <a-col :span="12">
            <span class="label">状态: </span>
            <span class="value">{{ state.archiveStatus === 0 ? '未归档' : '已归档' }}</span>
          </a-col>
        </a-row> -->
        <a-row class="mb15">
          <a-col :span="23">
            <span class="label">内容: </span>
            <div class="value editor-content-view" v-html="state.content"></div>
          </a-col>
        </a-row>
        <a-row class="mb15" v-if="state.knowledgeFlag !== 5">
          <a-col :span="5">
            <span class="label">附件列表: </span>
          </a-col>
          <a-col :span="19">
            <a-row v-for="(item, index) in fileList">
              <a-col :span="17">
                <a class="file" :href="state.accessory.split(',')[index]" target="_blank">{{
                  item
                }}</a>
              </a-col>
              <a-col :span="2">
                <a-button class="link-btn" type="link" @click="handleUploadFile(index)"
                  >下载</a-button
                >
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row class="mb15" v-if="state.knowledgeFlag !== 5">
          <a-col :span="5">
            <span class="label">相关知识: </span>
          </a-col>
          <a-col :span="19">
            <div class="file" v-for="item in state.relateds">
              <router-link :to="{ name: 'ArticleDetail', query: { id: item.id } }">{{
                item.knowledgeName
              }}</router-link>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <!-- 基础信息 -->
      <a-col :span="8">
        <div class="user-info">
          <a-avatar :src="STATE.DEFAULT_AVATAR"></a-avatar>
          <div class="user-name">{{ state.creator }}</div>
          <!-- <div class="role">审核人员</div> -->
        </div>
        <el-divider />
        <div class="base-info mb24">
          <div class="title mb15">基本信息</div>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">科室</span></a-col>
            <a-col :span="12"
              ><span class="value">{{ state.user.deptName }}</span></a-col
            >
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">性别</span></a-col>
            <a-col :span="12"
              ><span class="value">{{ state.user.sex === 0 ? '男' : '女' }}</span></a-col
            >
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">联系电话</span></a-col>
            <a-col :span="12"
              ><span class="value">{{ state.user.moblie }}</span></a-col
            >
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">最后修改时间</span></a-col>
            <a-col :span="12"
              ><span class="value">{{ state.user.updateTime }}</span></a-col
            >
          </a-row>
          <a-row class="mb10">
            <a-col :span="12"><span class="label">直接领导</span></a-col>
            <a-col :span="12"
              ><span class="value">{{ state.user.higherUp }}</span></a-col
            >
          </a-row>
        </div>
        <div class="version">
          <div class="version-title">条目版本</div>
          <a-table :columns="columns" :data-source="state.logs" bordered>
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'operation'">
                <a-button type="link" class="action-btn" @click="handleViewContent(record.content)"
                  >查看</a-button
                >
              </template>
            </template>
          </a-table>
        </div>
        <div class="log">
          <div class="log-title">日志</div>
          <a-table
            rowKey="id"
            :columns="logColumns"
            :data-source="dataSource"
            :pagination="pagination"
            bordered
            @change="onTableChange"
          >
          </a-table>
          <!-- <a-table :columns="columns" :data-source="state.logs" bordered>
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'operation'">
                <a-button type="link" class="action-btn" @click="handleViewContent(record.content)"
                  >查看</a-button
                >
              </template>
            </template>
          </a-table> -->
        </div>
      </a-col>
    </a-row>
  </a-card>
  <correct-dialog
    v-if="correctState.visible"
    :id="(id as string)"
    @cancel="handleCloseCorrectDialog"
  />
  <view-content-dialog
    v-if="viewContentState.visible"
    :content="viewContentState.content"
    @cancel="handleCloseViewContentDialog"
  />
  <rate-dialog
    v-if="rateState.visible"
    :knowledgeId="rateState.id"
    @success="RateSuccessCallback"
    @cancel="handleCloseRateDialog"
  />
</template>
<script lang="ts">
export default {
  name: 'ArticleDetail',
};
</script>
<script lang="ts" setup>
import type { UserType } from '@/services/myKnowledge/knowledge';
import type { LabelListReturnProps } from '@/services/systemSetter/label';
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElDivider } from 'element-plus';
import { message } from 'ant-design-vue';
import { getKnowledgeDetail, getRateState } from '@/services/myKnowledge/knowledge';
import { collecteKnowledge, cancelCollecteKnowledge } from '@/services/myKnowledge/collection';
import { download } from '@/utils/downloadFile';
import { postDownloadLog, getDownloadLog } from '@/services/common';
import useSearchTableList from '@/composables/useSearchTableList';
import useShare from '@/composables/useShare';
import useCorrect from './composables/useCorrect';
import useViewContent from './composables/useViewContent';
import useRate from './composables/useRate';
import appConfig from '@/config/app.config';
import CorrectDialog from './sections/CorrectDialog.vue';
import ViewContentDialog from './sections/ViewContentDialog.vue';
import RateDialog from './sections/RateDialog.vue';

interface StateType {
  evaluate: number;
  accessory: string;
  archiveStatus: number;
  content: string;
  createTime: string;
  knowledgeName: string;
  knowledgeTypeName: string;
  knowledgeFlag: number;
  labels: LabelListReturnProps[];
  relateds: any[];
  securityLevelName: string;
  expirationType: string;
  endTime: string;
  collectStatus: number;
  creator: string;
  user: Partial<UserType>;
  archiveUserName: string;
  logs: any[];
}

const route = useRoute();
const router = useRouter();

const { id = '' } = route.query;

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
    dataIndex: 'creator',
  },
  {
    title: '修订时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];

const logColumns = [
  {
    title: '类型',
    dataIndex: 'logType',
    customRender({ text }: { text: number | string }) {
      return text === 0 ? '分享' : '下载';
    },
  },
  {
    title: '附件名称',
    dataIndex: 'accessoryName',
    customRender({ text }: { text: number | string }) {
      return text ?? '-';
    },
  },
  {
    title: '操作人',
    dataIndex: 'userName',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
  },
];

const fileList = ref<string[]>([]);

const rateValue = ref<number>(0);
const rateStatus = ref<boolean>(false);

const state = ref<StateType>({
  evaluate: 0,
  accessory: '',
  archiveStatus: 0,
  content: '',
  createTime: '',
  knowledgeName: '',
  knowledgeTypeName: '',
  labels: [],
  relateds: [],
  securityLevelName: '',
  expirationType: '',
  endTime: '',
  collectStatus: 0,
  creator: '',
  user: {},
  archiveUserName: '',
  logs: [],
  knowledgeFlag: 0,
});

const fetchDetailData = async () => {
  const res = await getKnowledgeDetail({ id: id as string });
  state.value = res;
  const accessoryList = res.accessory?.split(',');
  fileList.value =
    accessoryList &&
    accessoryList.map((item) => {
      const arr = item.split('/');
      return arr[arr.length - 1];
    });
  state.value.knowledgeTypeName = res.knowledgeTypeName.split(',').join('-');
  rateValue.value = res.evaluate;
};

const fetchRateState = async () => {
  const res = await getRateState({ knowledgeId: id as string });
  rateStatus.value = res;
};

// 获取日志数据
const { onSearch, pagination, dataSource, getList, onTableChange } = useSearchTableList({
  fetchData: getDownloadLog,
  formatParams() {
    const data: Record<string, any> = { knowledgeId: id as string };
    return data;
  },
});

onMounted(async () => {
  await fetchDetailData();
  await fetchRateState();
});

const handleUploadFile = async (index: number) => {
  const fileUrlList = state.value.accessory.split(',');
  download(fileUrlList[index], fileList.value[index]);
  await postDownloadLog({
    accessoryName: fileList.value[index],
    knowledgeId: id as string,
    logType: 1,
  });
};

const handleCollecte = async () => {
  const params = { knowledgeId: id as string };
  if (state.value.collectStatus === 1) {
    await cancelCollecteKnowledge(params);
    message.success('取消收藏成功！');
    state.value.collectStatus = 0;
    return;
  }
  await collecteKnowledge(params);
  message.success('收藏成功！');
  state.value.collectStatus = 1;
};

const { correctState, handleOpenCorrectDialog, handleCloseCorrectDialog } = useCorrect(
  id as string,
);

const { viewContentState, handleViewContent, handleCloseViewContentDialog } = useViewContent();

const { rateState, handleRate, handleCloseRateDialog } = useRate(id as string);

const RateSuccessCallback = () => {
  fetchDetailData();
  fetchRateState();
};

const { share } = useShare();
</script>

<style lang="less" scoped>
.title {
  flex: auto;
  // overflow: hidden;
  color: #000000d9;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5715;
  // white-space: nowrap;
  // text-overflow: ellipsis;
}
.user-info {
  text-align: center;
}
.log {
  margin-top: 20px;
}
.version-title,
.log-title {
  flex: auto;
  overflow: hidden;
  color: #000000d9;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5715;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.link-btn {
  height: auto;
  padding: 0;
}

.tag-item {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
