<template>
  <div id="knowledge-map"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getMap } from '@/services/myKnowledge/knowledge';
import { knowledgeFlag } from '@/constants/index';
const router = useRouter();

const markerArr = ref<Record<string, any>>([]);

const BMap = (window as any).BMap;

const fetchMapData = async () => {
  const res = await getMap();
  markerArr.value = res;
};

// 添加信息窗口
const addInfoWindow = (marker: any, poi: any) => {
  //pop弹窗标题
  const title = `<div style="font-weight:bold;color:#CE5521;font-size:14px">
    <a href="${window.location.protocol}${window.location.host}/${window.location.pathname}#/myKnowledge/article-detail?id=${poi.id}">${poi.knowledgeName}</a>
  </div>`;
  //pop弹窗信息
  const html = [
    `
    <table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif">
      <tbody>
        <tr>
          <td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">类型:</td>
          <td style="vertical-align:top;line-height:16px">${
            knowledgeFlag[poi.knowledgeFlag as keyof typeof knowledgeFlag]
          }</td>
        </tr>
        <tr>
          <td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">状态:</td>
          <td style="vertical-align:top;line-height:16px">已归档</td>
        </tr>
      </tbody>
    </table>
  `,
  ];
  const infoWindow = new BMap.InfoWindow(html.join(''), {
    title: title,
    width: 200,
  });

  const openInfoWinFun = () => {
    marker.openInfoWindow(infoWindow);
  };
  marker.addEventListener('click', openInfoWinFun);
  return openInfoWinFun;
};

onMounted(async () => {
  await fetchMapData();

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
  bdary.get(cityName, (rs: any) => {
    //获取行政区域
    const EN_JW = '180, 90;'; //东北角
    const NW_JW = '-180,  90;'; //西北角
    const WS_JW = '-180, -90;'; //西南角
    const SE_JW = '180, -90;'; //东南角
    //4.添加环形遮罩层
    const ply1 = new BMap.Polygon(
      rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW,
      {
        strokeColor: 'none',
        fillColor: '#fff',
        fillOpacity: 1,
        strokeOpacity: 0.5,
      },
    ); //建立多边形覆盖物
    map.addOverlay(ply1);
  });
  // 添加标注
  const addMarker = (point: string, index: number) => {
    // var myIcon = new BMap.Icon('http://api.map.baidu.com/img/markers.png', new BMap.Size(23, 25), {
    //   offset: new BMap.Size(10, 25),
    //   imageOffset: new BMap.Size(0, 0 - index * 25),
    // });
    const marker = new BMap.Marker(point);
    // , {
    //   icon: myIcon,
    // }
    map.addOverlay(marker);
    return marker;
  };
  //第7步：绘制点
  for (let i = 0; i < markerArr.value.length; i++) {
    const { longitude, latitude } = markerArr.value[i];
    const maker = addMarker(new BMap.Point(longitude, latitude), i);
    addInfoWindow(maker, markerArr.value[i]);
  }
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
