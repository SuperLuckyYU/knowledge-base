<template>
  <a-modal
    title="查看"
    :visible="true"
    :maskClosable="false"
    :closable="false"
    width="600px"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-row class="mb15">
      <a-col :span="5">
        <div>纠错内容:</div>
      </a-col>
      <a-col :span="19">
        {{ state.content }}
      </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <div>补充图片:</div>
      </a-col>
      <a-col :span="19">
        <img-upload disabled type="1" :modelValue="picMockObj" :max-length="picMockObj.length" />
        <!-- <img v-for="item in state.picture.split(',')" :src="item" class="pic" /> -->
      </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <span class="label">附件列表: </span>
      </a-col>
      <a-col :span="19">
        <a-row v-for="(item, index) in fileList">
          <a-col :span="17">
            <div class="file">{{ item }}</div>
          </a-col>
          <a-col :span="2">
            <a-button v-if="!!item" class="link-btn" type="link" @click="handleUploadFile(index)"
              >下载</a-button
            >
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <div>纠错人:</div>
      </a-col>
      <a-col :span="19"> {{ state.opUser }} </a-col>
    </a-row>
    <a-row class="mb15">
      <a-col :span="5">
        <div>纠错时间:</div>
      </a-col>
      <a-col :span="19">{{ state.createTime }} </a-col>
    </a-row>
    <template #footer>
      <a-button key="back" @click="onModalClose">关闭</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs } from 'vue';
import { download } from '@/utils/downloadFile';
import { getErrorCorrectionDetail } from '@/services/myKnowledge/errorCorrection';
import { mockImgUrl } from '@/utils/utils';
import ImgUpload from '@/components/ImgUpload/index.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const fileList = ref<string[]>([]);

const state = reactive({
  accessory: '',
  content: '',
  createTime: '',
  id: '',
  knowledgeId: '',
  opUser: '',
  picture: '',
  userId: '',
});

const picMockObj = ref<
  {
    uid: string;
    name: string;
    status: string;
    thumbUrl: string;
    type: string;
    response: string;
  }[]
>([]);

const { id } = toRefs(props);

const fetchDetail = async () => {
  const res = await getErrorCorrectionDetail({ knowledgeId: id.value });
  Object.assign(state, res);
  const accessoryList = res.accessory.split(',');
  fileList.value = accessoryList.map((item) => {
    const arr = item.split('/');
    return arr[arr.length - 1];
  });
  if (res.picture) {
    const picList = state.picture.split(',');
    picMockObj.value = mockImgUrl(picList);
  }
};

onMounted(() => {
  fetchDetail();
});

const handleUploadFile = (index: number) => {
  const fileUrlList = state.accessory.split(',');
  download(fileUrlList[index], fileList.value[index]);
};

const handleSubmit = () => {
  emit('success');
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel');
};
</script>

<style lang="less" scoped>
.pic {
  width: 200px;
  height: 200px;
  margin: 0 10px 10px 0;
}
</style>
