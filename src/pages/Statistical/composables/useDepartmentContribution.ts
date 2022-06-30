import type { ChartProps } from '@/services/common';
import { ref } from 'vue';
import { getDepartmentContribution } from '@/services/statistics';

const useDepartmentContribution = () => {
  const departmentContributionOption = ref({
    title: {
      text: '科室贡献',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [
        '',
        // '排水科',
        // '河长制工作科',
        // '办公室',
        // '海淀区水政监察大队',
        // '海淀区水利工程质量监督站',
        // '水资源管理及行政审批科',
        // '海淀区节约用水事务管理中心',
        // '海淀区河道管理所',
        // '节水管理科',
        // '海淀区排水管理所',
        // '工程计划科',
        // '水政科',
        // '综合管理科',
      ],
    },
    series: [
      {
        name: '科室贡献',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          {},
          // { value: 34, name: '排水科' },
          // { value: 43, name: '河长制工作科' },
          // { value: 34, name: '办公室' },
          // { value: 23, name: '海淀区水政监察大队' },
          // { value: 23, name: '海淀区水利工程质量监督站' },
          // { value: 12, name: '水资源管理及行政审批科' },
          // { value: 31, name: '海淀区节约用水事务管理中心' },
          // { value: 45, name: '海淀区河道管理所' },
          // { value: 32, name: '节水管理科' },
          // { value: 23, name: '海淀区排水管理所' },
          // { value: 67, name: '工程计划科' },
          // { value: 43, name: '水政科' },
          // { value: 23, name: '综合管理科' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });

  const fetchDepartmentContributionData = async (params: ChartProps) => {
    const res = await getDepartmentContribution(params);
    departmentContributionOption.value.series[0].data = res.map((item) => ({
      value: item.num,
      name: item.xAxisData,
    }));
    departmentContributionOption.value.legend.data = res.map((item) => {
      return item.xAxisData;
    });
  };

  return {
    departmentContributionOption,
    fetchDepartmentContributionData,
  };
};

export default useDepartmentContribution;
