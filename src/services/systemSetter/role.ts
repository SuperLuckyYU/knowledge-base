import request, { get, post } from '@/utils/request';
export interface RoleItemType {
  id: string;
  roleCode: string;
  roleCreator: string;
  roleDesc: string;
  roleModules: string;
  roleName: string;
  updateTime: string;
  menus?: { menuId: string; status: string }[];
}

export interface RoleListProps {
  roleName?: string;
}

export interface RoleListItemProps {
  createTime: string;
  id: string;
  roleCode: string;
  roleCreator: string;
  roleDesc: string;
  roleModules: string;
  roleName: string;
  updateTime: string;
}

export interface RoleListReturnProps {
  current: number;
  pages: number;
  records: RoleListItemProps[];
  searchCount: boolean;
  size: number;
  total: number;
}

export const getRoleList = <RoleListProps, RoleListReturnProps>(data: RoleListProps) => {
  return get<RoleListReturnProps>('/role/query', data);
};

export type CommonOpreateReturnType = boolean;

export interface CreateProps {
  menuDTOS: {
    menuId: string;
    status?: 0 | 1;
  }[];
  roleModules: string;
  roleName: string;
  roleDesc?: string;
}

export const createRole: {
  (data: CreateProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return post('/role/save', data);
};

interface UpdateProps extends CreateProps {
  id: string;
}

export const updateRole: {
  (data: UpdateProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return post('/role/update', data);
};
interface DelProps {
  roleId: string;
}

export const delRole: {
  (data: DelProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return get('/role/del', data);
};
export interface MenuListItemType {
  children?: MenuListItemType[];
  id: string;
  parentId: string;
  menuName: string;
}

export type MenuReturnProps = MenuListItemType[];

export const getMenuTree = () => {
  return get<MenuReturnProps>('/menu/tree/query');
};

export interface RoleItemDetailType {
  current: number;
  pages: number;
  records: RoleListItemProps[];
  searchCount: boolean;
  size: number;
  total: number;
}

interface DetailProps {
  id: string;
}

export const getRoleDetail: {
  (data: DetailProps): Promise<RoleItemType>;
} = (data) => {
  return get('/role/detail', data);
};
