import request, { get, post } from '@/utils/request';

export interface UserItemType {
  account: string;
  articleNum: number;
  createTime: string;
  creator: string;
  deptId: string;
  higherUp: string;
  id: string;
  moblie: string;
  officeTelephone: string;
  position: string;
  updateTime: string;
  userName: string;
  roleName: string;
}

interface UserListProps {
  rid?: string;
  userName?: string;
  deptId?: string;
}

export interface DeptListItemType {
  children?: DeptListItemType[];
  deptName: string;
  id: string;
  parentId: string;
}

export const getUserList = <UserListProps, UserListReturnProps>(data: UserListProps) => {
  return get<UserListReturnProps>('/user/query', data);
};

export type DeptListReturnProps = DeptListItemType[];

export const getDeptList = <T, UserListReturnProps>() => {
  return get<DeptListReturnProps>('/dept/tree/query');
};

interface SetRoleParams {
  userId: string;
  roleIds: string[];
}

type SetRoleReturnType = boolean;

export const setRole = <SetRoleParams, SetRoleReturnType>(data: SetRoleParams) => {
  return post<SetRoleReturnType>('/user/set/role', data);
};
