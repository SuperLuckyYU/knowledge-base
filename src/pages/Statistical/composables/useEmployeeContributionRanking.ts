import { ref } from 'vue';

const useEmployeeContributionRanking = () => {
  const employeeContributionData = ref<Record<string, any>[]>([]);

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
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '科室',
      dataIndex: 'dipt',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'num',
      align: 'center',
    },
  ];

  const fetchEmployeeContributionData = async () => {};

  return {
    employeeContributionRankingColumns,
    employeeContributionData,
    fetchEmployeeContributionData,
  };
};

export default useEmployeeContributionRanking;
