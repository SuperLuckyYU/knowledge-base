import request, { get, post } from '@/utils/request';
import type { ChartProps } from '@/services/common';
interface KnowledgeNumberReturnProps {
  dictName: string;
  num: number;
}

export interface CommonReturnProps {
  xAxisData: string;
  num: number;
}

export const getKnowledgeNumber = (data: ChartProps) => {
  return get<KnowledgeNumberReturnProps[]>('/dict/statistics/type/knowledge/number', data);
};

export const getDateRangeKnowledgeNumber = (data: ChartProps) => {
  return get<CommonReturnProps[]>('/base/statistics/increase', data);
};

export const getKnowledgeTypeNumber = (data: ChartProps) => {
  return get<CommonReturnProps[]>('/dict/statistics/knowledge/flag/number', data);
};

export interface EmployeeContributionReturnProps {
  deptId: string;
  deptName: string;
  num: number;
  userName: string;
}

export const getEmployeeContribution = (data: ChartProps) => {
  return get<EmployeeContributionReturnProps[]>('/user/statistics/user/create/knowledge/num', data);
};

interface DepartmentContributionProps {
  xAxisData: string;
  num: number;
}

export const getDepartmentContribution = (data: ChartProps) => {
  return get<DepartmentContributionProps[]>('/dept/statistics/dept/create/knowledge/ration', data);
};
