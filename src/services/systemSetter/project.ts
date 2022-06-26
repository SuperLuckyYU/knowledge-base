import request, { get, post } from '@/utils/request';
import type { ListBaseReturnProps } from '@/services/common';
interface ProjectListProps {
  itemName?: string;
}
export interface ProjectListReturnProps {
  createTime: string;
  departments: string;
  endTime: string;
  id: string;
  itemName: string;
  principal: string;
  startTime: string;
  team: string;
  updateTime: string;
}

export const getProjectList = (data?: ProjectListProps) => {
  return get<ListBaseReturnProps<ProjectListReturnProps>>('/item/query', data);
};
