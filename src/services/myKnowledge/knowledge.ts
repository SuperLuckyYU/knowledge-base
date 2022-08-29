import type { ListBaseReturnProps } from '@/services/common';
import type { LabelListReturnProps } from '@/services/systemSetter/label';
import request, { get, post } from '@/utils/request';

export interface listProps {
  labelId?: string;
  knowledgeName?: string;
}
export interface UserType {
  account: string;
  articleNum: number;
  createTime: string;
  creator: string;
  deptId: string;
  deptName: string;
  higherUp: string;
  id: string;
  moblie: string;
  officeTelephone: string;
  opUser: string;
  position: string;
  roleName: string;
  sex: number;
  updateTime: string;
  userName: string;
}
export interface listReturnProps {
  accessory: string;
  archiveStatus: number;
  archiveTime: string;
  browseNum: string;
  content: string;
  createTime: string;
  documentNum: string;
  endTime: string;
  evaluate: number;
  id: string;
  itemId: string;
  itemName: string;
  knowledgeFlag: number;
  knowledgeFlagName: string;
  knowledgeName: string;
  knowledgeType: string;
  knowledgeTypeName: string;
  expirationType: string;
  labels: LabelListReturnProps[];
  latitude: string;
  location: string;
  longitude: string;
  pagination: string;
  securityLevel: string;
  securityLevelName: string;
  startTime: string;
  types: string;
  updateTime: string;
  userId: string;
  userName: string;
  relateds: any[];
  collectStatus: number;
  version: string;
  creator: string;
  user: UserType;
  archiveUserName: string;
  logs: any[];
}

export const getMyKnowledgeList = (data: listProps) => {
  return get<ListBaseReturnProps<listReturnProps>>('/base/query', data);
};

export const updalodFile = (data: FormData) => {
  return post<string>('/file/upload', data, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
};

export interface CreateMyKnowledgeProps {
  knowledgeFlag: string;
  knowledgeName: string;
  types: string;
  accessory: string;
  documentNum: string;
  archiveTime: string;
  pagination: string;
  location: string;
  content: string;
  labels: string;
  securityLevel: string;
  endTime: string;
  itemId: string;
  longitude: string;
  latitude: string;
  expirationType: string;
}

export interface UpdateMyKnowledgeProps extends CreateMyKnowledgeProps {
  id: string;
  version: string;
}

export const createMyKnowledge = (data: CreateMyKnowledgeProps) => {
  return post<boolean>('/base/save', data);
};

export const updateMyKnowledge = (data: UpdateMyKnowledgeProps) => {
  return post<boolean>('/base/update', data);
};

export const getKnowledgeDetail = (data: { id: string }) => {
  return get<listReturnProps>('/base/detail', data);
};

export const delKnowledge = (data: { id: string }) => {
  return get<boolean>('/base/del', data);
};

interface CreateDocKnowledgeProps {
  accessory: string;
  knowledgeType: string;
  knowledgeName: string;
  knowledgeFlag: string;
  // labels: string;
}

export const createDocKnowledge = (data: CreateDocKnowledgeProps[]) => {
  return post<boolean>('base/batch/save', data, { useGenParams: false });
};

export const rateKnowledge = (data: { knowledgeId: string }) => {
  return post<boolean>('base/rate/save', data);
};

export const getRateState = (data: { knowledgeId: string }) => {
  return get<boolean>('base/rate/check/state', data);
};

export const getRanking = () => {
  return get<ListBaseReturnProps<listReturnProps>>('base/query/ranking');
};

export const getMap = () => {
  return get<ListBaseReturnProps<listReturnProps>>('base/query/map');
};
