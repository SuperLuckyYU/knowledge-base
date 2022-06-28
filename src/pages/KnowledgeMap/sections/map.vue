<template>
  <div id="knowledge-map"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

const BMap = (window as any).BMap;

onMounted(() => {
  // 创建地图实例
  const map = new BMap.Map('knowledge-map');
  //设置地图的中心点如合肥的坐标
  const point = new BMap.Point(116.23376, 40.01477);
  // 初始化地图，设置中心点坐标和地图级别
  map.centerAndZoom(point, 12);
  // 允许滚轮缩放
  map.enableScrollWheelZoom();
  //只显示某个省份的关键代码
  const cityName = '北京海淀区';
  const bdary = new BMap.Boundary();
  bdary.get(cityName, function (rs: any) {
    //获取行政区域
    const EN_JW = '180, 90;'; //东北角
    const NW_JW = '-180,  90;'; //西北角
    const WS_JW = '-180, -90;'; //西南角
    const SE_JW = '180, -90;'; //东南角
    //4.添加环形遮罩层
    var ply1 = new BMap.Polygon(rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW, {
      strokeColor: 'none',
      fillColor: '#fff',
      fillOpacity: 1,
      strokeOpacity: 0.5,
    }); //建立多边形覆盖物
    map.addOverlay(ply1);
  });
});
</script>

<style lang="less" scoped>
#knowledge-map {
  width: 100%;
  height: 700px;
}
#r-result {
  width: 100%;
}
</style>
