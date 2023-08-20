import type { ChartProps } from '@/services/common';
import { ref } from 'vue';
import { getKnowledgeTypeNumber } from '@/services/statistics';
import { generateChartData } from '@/utils/chart';

const useKnowledgeTypeCountStatistic = () => {
  const typeCountStatisticalOption = ref({
    title: {
      text: '知识类型数量统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} 个',
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
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  });

  const fetchKnowledgeTypeNumber = async (params: ChartProps) => {
    const res = await getKnowledgeTypeNumber(params);
    const { xAxisData, seriesData } = generateChartData(res, params, 'flag');
    typeCountStatisticalOption.value.xAxis.data = xAxisData;
    typeCountStatisticalOption.value.series[0].data = seriesData;
  };

  return {
    typeCountStatisticalOption,
    fetchKnowledgeTypeNumber,
  };
};

export default useKnowledgeTypeCountStatistic;
