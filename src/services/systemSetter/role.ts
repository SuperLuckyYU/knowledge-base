import request, { get, post } from '@/utils/request';
export interface RoleItemType {
  id: string;
  name: string;
  module: string;
  desc: string;
}

interface RoleListProps {
  roleName?: string;
}

interface RoleListReturnProps {
  createTime: string;
  id: string;
  roleCode: string;
  roleCreator: string;
  roleDesc: string;
  roleModules: string;
  roleName: string;
  updateTime: string;
}

export const getRoleList = <RoleListProps, RoleListReturnProps>(data: RoleListProps) => {
  return get<RoleListReturnProps>('/api/role/query', data);
};
