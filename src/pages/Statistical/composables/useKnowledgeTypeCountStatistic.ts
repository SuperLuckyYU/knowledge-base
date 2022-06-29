import { ref } from 'vue';

const useKnowledgeTypeCountStatistic = () => {
  const typeCountStatisticalOption = ref({
    title: {
      text: '知识类型数量统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    xAxis: {
      type: 'category',
      data: ['专题', '图片', '视频', '文件'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '知识类型数量统计',
        type: 'bar',
        data: [120, 200, 150, 80],
      },
    ],
  });

  const fetchKnowledgeTypeNumber = async () => {};

  return {
    typeCountStatisticalOption,
    fetchKnowledgeTypeNumber,
  };
};

export default useKnowledgeTypeCountStatistic;
