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

export const getAudiList = <listProps, listReturnProps>(data: listProps) => {
  return get<listReturnProps>('/base/archive/query', data);
};
