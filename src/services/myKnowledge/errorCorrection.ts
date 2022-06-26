import type { ListBaseReturnProps } from '@/services/common';
import request, { get, post } from '@/utils/request';

interface listProps {
  labelId?: string;
  knowledgeName?: string;
}

interface listReturnProps {
  accessory: string;
  archiveStatus: string;
  archiveTime: string;
  browseNum: string;
  content: string;
  createTime: string;
  documentNum: string;
  endTime: string;
  evaluate: string;
  id: string;
  itemId: string;
  itemName: string;
  knowledgeFlag: string;
  knowledgeFlagName: string;
  knowledgeName: string;
  knowledgeType: string;
  labelId: string;
  latitude: string;
  location: string;
  longitude: string;
  pagination: string;
  securityLevel: string;
  startTime: string;
  types: string;
  updateTime: string;
  userId: string;
  userName: string;
}

export const getMyErrorCorrectionList = (data: listProps) => {
  return get<ListBaseReturnProps<listReturnProps>>('/base/error/correction/query', data);
};

interface CorrectKnowledgeProps {
  knowledgeId: string;
  content: string;
  picture: string;
  accessory: string;
}

interface ErrorCorrectionDetailReturnProps {
  accessory: string;
  content: string;
  createTime: string;
  id: string;
  knowledgeId: string;
  opUser: string;
  picture: string;
  userId: string;
}

export const correctKnowledge = (data: CorrectKnowledgeProps) => {
  return post<boolean>('/base/error/correction/save', data);
};

export const getErrorCorrectionDetail = (data: { knowledgeId: string }) => {
  return get<ErrorCorrectionDetailReturnProps>('/base/error/correction/detail', data);
};

export const delErrorCorrection = (data: { knowledgeId: string }) => {
  return get<boolean>('/base/error/correction/del', data);
};
