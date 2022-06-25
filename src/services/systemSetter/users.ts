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

export const getDeptList = () => {
  return get<DeptListReturnProps>('/dept/tree/query');
};

interface DelRoleParams {
  userIds: string;
}

interface SetRoleParams extends DelRoleParams {
  roleIds: string;
}

type CommonReturnType = boolean;

export const setRole: {
  (data: SetRoleParams): Promise<CommonReturnType>;
} = (data) => {
  return post('/user/set/role', data);
};

export const delRole: {
  (data: DelRoleParams): Promise<CommonReturnType>;
} = (data) => {
  return get('/user/del/role', data);
};
