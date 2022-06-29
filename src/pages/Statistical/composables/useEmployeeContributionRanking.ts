import type { ChartProps } from '@/services/common';
import type { EmployeeContributionReturnProps } from '@/services/statistics';
import { ref } from 'vue';
import { getEmployeeContribution } from '@/services/statistics';

const useEmployeeContributionRanking = () => {
  const employeeContributionData = ref<EmployeeContributionReturnProps[]>([]);

  const employeeContributionRankingColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      customRender: ({ index }: { index: number }) => {
        return index + 1;
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '科室',
      dataIndex: 'deptName',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'num',
      align: 'center',
    },
  ];

  const fetchEmployeeContributionData = async (params: ChartProps) => {
    const res = await getEmployeeContribution(params);
    employeeContributionData.value = res;
  };

  return {
    employeeContributionRankingColumns,
    employeeContributionData,
    fetchEmployeeContributionData,
  };
};

export default useEmployeeContributionRanking;
