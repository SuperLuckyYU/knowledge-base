import type { ListBaseReturnProps } from '@/services/common';
import request, { get, post } from '@/utils/request';

export interface LabelItemType {
  id: string;
  name: string;
  create_time: string;
  creator: string;
}

interface ListProps {
  knowledgeType?: string;
  knowledgeName?: string;
  creator?: string;
  labelId?: string;
  itemId?: string;
  dateRange?: string;
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
  evaluate: string;
  id: string;
  itemId: string;
  itemName: string;
  knowledgeFlag: string;
  knowledgeFlagName: string;
  knowledgeName: string;
  knowledgeType: string;
  expirationType: string;
  labels: string[];
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
  relateds: any[];
  collectStatus: number;
  version: string;
  creator: string;
}

export const getKnowledgeList = (data: ListProps) => {
  return get<ListBaseReturnProps<listReturnProps>>('/base/query', data);
};
