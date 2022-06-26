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

export const getMyCollectionList = (data: listProps) => {
  return get<ListBaseReturnProps<listReturnProps>>('/base/collection/query', data);
};

interface CollectionKnowledgeProps {
  knowledgeId: string;
}

export const collecteKnowledge = (data: CollectionKnowledgeProps) => {
  return get<boolean>('/base/collection', data);
};

export const cancelCollecteKnowledge = (data: CollectionKnowledgeProps) => {
  return get<boolean>('/base/cancel/collection', data);
};
