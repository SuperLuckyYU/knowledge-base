import { ref } from 'vue';

const useKnowledgeCountTrend = () => {
  const countTrendOption = ref({
    title: {
      text: '知识数量增长趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    xAxis: {
      type: 'category',
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
        name: '知识数量增长趋势',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  });

  const fetchDataRangeCount = async () => {};

  return {
    countTrendOption,
    fetchDataRangeCount,
  };
};

export default useKnowledgeCountTrend;
