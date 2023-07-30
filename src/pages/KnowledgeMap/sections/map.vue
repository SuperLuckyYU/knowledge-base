<template>
  <a-row class="mb10">
    <a-col :span="10" class="mr10">
      <a-input type="text" v-model:value="keyword" placeholder="请输入要搜索的知识标题" />
    </a-col>
    <a-col :span="3">
      <a-button type="primary" @click="search">搜索</a-button>
    </a-col>
  </a-row>
  <div id="knowledge-map"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getMap } from '@/services/myKnowledge/knowledge';
import { knowledgeFlag } from '@/constants/index';
import blueMarkerUrl from '../img/markers_blue.png';
import defaultMarkerUrl from '../img/markers_red.png';
const router = useRouter();

const map = ref(null); // 用于保存地图实例的引用
const pointMarkers = ref([]); // 用于保存标注的数组
const markerArr = ref<Record<string, any>[]>([]);
const pointArr = ref<Record<string, any>[]>([]);
const searchResult = ref<Record<string, any>>([]);

const points = ref<Record<string, any>>([]);
const keyword = ref('');

const BMap = (window as any).BMap;

const fetchMapData = async (knowledgeName?: string) => {
  const res = await getMap(knowledgeName);
  if (knowledgeName) {
    searchResult.value = res;
  } else {
    markerArr.value = res;
  }
};

// 添加信息窗口
const addInfoWindow = (marker: any, poi: any) => {
  //pop弹窗标题
  const title = `<div style="font-weight:bold;color:#CE5521;font-size:14px">
    <a href="#/myKnowledge/article-detail?id=${poi.id}">${poi.knowledgeName}</a>
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

// 添加标注
const addMarker = (point, newIcon) => {
  // ... 添加标注的逻辑 ...
  const marker = new BMap.Marker(point, { icon: newIcon });
  map.value.addOverlay(marker);
  pointMarkers.value.push(marker); // 将标注保存到数组中
  return marker;
};

const addPolyline = (_point?: Record<string, any>, icon?: Record<string, any>) => {
  const newIcon = icon ? icon : new BMap.Icon(defaultMarkerUrl, new BMap.Size(32, 32));
  for (let i = 0; i < markerArr.value.length; i++) {
    const place = JSON.parse(markerArr.value[i].place + '') ?? [];
    let lineArr = [];
    for (let j = 0; j < place.length; j++) {
      const placeItem = place[j][1];
      const lonArr = placeItem.split(',');
      const longitude = lonArr[0];
      const latitude = lonArr[1];
      const point = _point ? _point : new BMap.Point(longitude, latitude);
      lineArr.push(point);
      points.value.push(point);
      const maker = addMarker(point, newIcon);
      maker.originalData = markerArr.value[i];
      pointArr.value.push(maker);
      addInfoWindow(maker, markerArr.value[i]);
    }

    // 创建折线对象
    let lineColor = 'red';
    for (let q = 0; q < searchResult.value.length; q++) {
      const searchResultItem = searchResult.value[q];
      if (searchResultItem.id === markerArr.value[i].id) {
        lineColor = 'blue';
      } else {
        lineColor = 'red';
      }
    }
    const polyline = new BMap.Polyline(lineArr, {
      strokeColor: lineColor,
      strokeWeight: 2,
      strokeOpacity: 0.5,
    });

    // 添加折线到地图
    map.value.addOverlay(polyline);
    lineArr = [];
  }
};

onMounted(async () => {
  await fetchMapData();

  // 创建地图实例
  const mapInstance = new BMap.Map('knowledge-map');
  map.value = mapInstance;
  //设置地图的中心点如合肥的坐标
  const point = new BMap.Point(116.23376, 40.01477);
  // 初始化地图，设置中心点坐标和地图级别
  mapInstance.centerAndZoom(point, 12);
  // 允许滚轮缩放
  mapInstance.enableScrollWheelZoom();
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
    mapInstance.addOverlay(ply1);
  });

  addPolyline();
});

// 更新标注的图标大小和颜色
const updateMarkerIcon = () => {
  map.value?.clearOverlays();
  addPolyline();
  for (let i = 0; i < pointArr.value.length; i++) {
    const point = pointArr.value[i];
    const {
      point: { lng, lat },
    } = point;
    let isMatched = false;
    for (let j = 0; j < searchResult.value.length; j++) {
      const knowledgeItem = searchResult.value[j];
      const placeArr = JSON.parse(knowledgeItem.place);
      for (let k = 0; k < placeArr.length; k++) {
        const placeItem = placeArr[k];
        if (placeItem[1] === `${lng},${lat}`) {
          isMatched = true;
        }
      }
    }
    const iconSize = isMatched ? new BMap.Size(32, 32) : new BMap.Size(32, 32); // 匹配到的标注设置为大图标，未匹配到的设置为小图标
    const iconUrl = isMatched ? blueMarkerUrl : defaultMarkerUrl; // 自定义图标的 URL
    const newIcon = new BMap.Icon(iconUrl, iconSize);
    const maker = addMarker(point.point, newIcon); // 重新添加标注
    addInfoWindow(maker, point.originalData);
  }
};

// 搜索
const search = async () => {
  if (!keyword.value) {
    searchResult.value = [];
    map.value?.clearOverlays();
    addPolyline();
  } else {
    await fetchMapData(keyword.value);
    updateMarkerIcon();
  }
};
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
