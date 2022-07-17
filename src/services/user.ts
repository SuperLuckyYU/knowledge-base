import type { MenuReturnProps } from './systemSetter/role';
import { get } from '@/utils/request';

export interface UserType {
  account: string;
  articleNum: string;
  createTime: string;
  creator: string;
  deptId: string;
  deptName: string;
  depts: string;
  higherUp: string;
  id: string;
  idCard: string;
  moblie: string;
  officeTelephone: string;
  opUser: string;
  pUserId: string;
  photo: string;
  position: string;
  puserId: string;
  roleName: string;
  sex: 1 | 2;
  updateTime: string;
  userName: string;
}

export async function fetchCurrentUser(data: { token: string }) {
  return get<UserType>('/user/parse/token', data);
}

export async function fetchMenuAuth() {
  return get<MenuReturnProps>('/menu/query/user');
}
