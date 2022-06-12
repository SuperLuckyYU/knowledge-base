import request, { get, post } from '@/utils/request';

interface ProjectListProps {
  itemName?: string;
}

interface ProjectListReturnProps {
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

export const getProjectList = <ProjectListProps, ProjectListReturnProps>(
  data: ProjectListProps,
) => {
  return get<ProjectListReturnProps>('/api/item/query', data);
};
