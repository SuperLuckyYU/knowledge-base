import request, { get, post } from '@/utils/request';
export interface RoleItemType {
  id: string;
  name: string;
  module: string;
  desc: string;
}

export interface RoleListProps {
  roleName?: string;
}

export interface RoleListReturnProps {
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
  return get<RoleListReturnProps>('/role/query', data);
};
