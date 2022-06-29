import { ref } from 'vue';

const useKnowledgeTypeCountTrend = () => {
  const typeCountTrendOption = ref({
    title: {
      text: '知识数量增长趋势',
      left: 'left',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['专题', '视频', '图片', '文档'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '2022-06-20',
        '2022-06-21',
        '2022-06-22',
        '2022-06-23',
        '2022-06-24',
        '2022-06-25',
        '2022-06-26',
      ],
      axisLabel: {
        interval: 0,
        rotate: -38,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '专题',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '视频',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '图片',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '文档',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
    ],
  });

  const fetchDateRangeTypeCount = async () => {};

  return {
    typeCountTrendOption,
    fetchDateRangeTypeCount,
  };
};

export default useKnowledgeTypeCountTrend;
