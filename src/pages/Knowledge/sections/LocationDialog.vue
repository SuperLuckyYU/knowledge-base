<!-- 获取定位弹窗 -->
<template>
  <a-modal
    :visible="true"
    title="获取位置"
    :closable="false"
    width="600px"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="onModalClose"
  >
    <a-row class="mb10">
      <a-col :span="10" class="mr10">
        <a-input type="text" v-model:value="keyword" placeholder="请输入要搜索的地点或地址" />
      </a-col>
      <a-col :span="3">
        <a-button type="primary" @click="searchLocation">搜索</a-button>
      </a-col>
    </a-row>
    <div id="map" style="width: 100%; height: 400px"></div>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, toRaw } from 'vue';
import { cloneDeep } from 'lodash-es';

const map = ref<Record<string, any>>();

interface Props {
  modelValue: [];
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel', 'update:modelValue']);

const { modelValue } = toRefs(props);

const location = ref([]);
const keyword = ref('');

const BMapGL = (window as any).BMapGL;

onMounted(() => {
  map.value = new BMapGL.Map('map');
  map.value?.centerAndZoom(new BMapGL.Point(116.23376, 40.01477), 12);
  const geoc = new BMapGL.Geocoder();
  map.value?.addEventListener('click', function (e: any) {
    //清除地图上所有的覆盖物
    map.value?.clearOverlays();
    const pt = e.latlng;
    const marker = new BMapGL.Marker(new BMapGL.Point(pt.lng, pt.lat));
    map.value?.addOverlay(marker);
    geoc.getLocation(pt, function (rs: any) {
      const { lng, lat } = pt;
      const geoc = new BMapGL.Geocoder();
      geoc.getLocation(pt, (result: Record<string, any>) => {
        if (result) {
          const currentAddressName = result.address + result.content.poi_desc; // 获取解析后的地理名称
          location.value = [];
          location.value.push([currentAddressName, `${lng},${lat}`]);
        }
      });
    });
  });
});

const searchLocation = () => {
  const localSearch = new BMapGL.LocalSearch('北京', {
    onSearchComplete(results: Record<string, any>) {
      if (results) {
        // 清除之前的标记
        map.value?.clearOverlays();
        // 获取第一个搜索结果的坐标，并在地图上标记
        const point = results.getPoi(0).point;
        map.value?.centerAndZoom(point, 15);
        const marker = new BMapGL.Marker(point);
        map.value?.addOverlay(marker);
        const { lng, lat } = point;
        const geoc = new BMapGL.Geocoder();
        geoc.getLocation(point, (result: Record<string, any>) => {
          if (result) {
            const currentAddressName = result.address + result.content.poi_desc; // 获取解析后的地理名称
            location.value = [];
            location.value.push([currentAddressName, `${lng},${lat}`]);
          }
        });
      } else {
        alert('未找到相关地点，请重新搜索！');
      }
    },
  });
  localSearch.search(keyword.value);
};

const handleSubmit = async () => {
  const arr = modelValue.value ? modelValue.value : [];
  emit('update:modelValue', [...arr, ...location.value]);
  emit('success');
  onModalClose();
};

// 弹窗关闭
const onModalClose = () => {
  emit('cancel', false);
};
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
