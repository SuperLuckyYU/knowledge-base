import type { ChartProps } from '@/services/common';
import { ref } from 'vue';
import { getKnowledgeNumber } from '@/services/statistics';

const useKnowledgeCountStatistic = () => {
  const countStatisticalOption = ref({
    title: {
      text: '知识数量统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} 个',
    },
    xAxis: {
      type: 'category',
      // data: ['法律', '行政法规', '部门规章', '水资源利用', '海绵城市', '蓄滞洪区建设', '年鉴'],
      data: [''],
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
        name: '知识数量统计',
        type: 'bar',
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: [0],
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  });

  const fetchKnowledgeNumber = async (params: ChartProps) => {
    const res = await getKnowledgeNumber(params);
    const xAxisData: string[] = [];
    const seriesData: number[] = [];
    res.forEach((item) => {
      xAxisData.push(item.dictName);
      seriesData.push(item.num);
    });
    countStatisticalOption.value.xAxis.data = xAxisData;
    countStatisticalOption.value.series[0].data = seriesData;
  };

  return {
    countStatisticalOption,
    fetchKnowledgeNumber,
  };
};

export default useKnowledgeCountStatistic;
