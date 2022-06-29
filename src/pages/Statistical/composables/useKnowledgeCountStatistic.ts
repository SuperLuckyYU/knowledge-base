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
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    xAxis: {
      type: 'category',
      data: ['法律', '行政法规', '部门规章', '水资源利用', '海绵城市', '蓄滞洪区建设', '年鉴'],
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
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  });

  const fetchKnowledgeNumber = async () => {
    const res = await getKnowledgeNumber();
    console.log('🚀 ~ file: index.vue ~ line 48 ~ fetchKnowledgeNumber ~ res', res);
  };

  return {
    countStatisticalOption,
    fetchKnowledgeNumber,
  };
};

export default useKnowledgeCountStatistic;
