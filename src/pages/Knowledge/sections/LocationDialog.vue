<!-- 获取定位弹窗 -->
<template>
  <a-modal :visible="true" title="获取位置" :closable="false" width="600px" :destroyOnClose="true" @ok="handleSubmit"
    @cancel="onModalClose">
    <div id='map' style="width: 100%; height: 400px"></div>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue';
import { cloneDeep } from 'lodash';

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel', 'update:modelValue']);

const { modelValue } = toRefs(props);

const location = ref('');
location.value = cloneDeep(modelValue.value)

const BMapGL = (window as any).BMapGL;

onMounted(() => {
  const map = new BMapGL.Map('map');
  map.centerAndZoom(new BMapGL.Point(116.23376, 40.01477), 12);
  const geoc = new BMapGL.Geocoder();
  map.addEventListener('click', function (e: any) {
    //清除地图上所有的覆盖物
    map.clearOverlays();
    const pt = e.latlng;
    const marker = new BMapGL.Marker(new BMapGL.Point(pt.lng, pt.lat));
    map.addOverlay(marker);
    geoc.getLocation(pt, function (rs: any) {
      console.log("🚀 ~ file: LocationDialog.vue ~ line 39 ~ geoc.getLocation ~ rs", rs.point)
      const { lng, lat } = rs.point
      emit('update:modelValue', `${lng}, ${lat}`)
      // const addComp = rs.addressComponents;
    })
  })
})


const handleSubmit = async () => {
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
