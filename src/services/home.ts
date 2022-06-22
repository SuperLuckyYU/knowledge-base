import request, { get, post } from '@/utils/request';

export interface LabelItemType {
  id: string;
  name: string;
  create_time: string;
  creator: string;
}

interface LabelListProps {
  itemName?: string;
}

interface LabelListReturnProps {
  createTime: string;
  id: string;
  knowledgeNum: string;
  labelCreator: string;
  labelName: string;
  updateTime: string;
}

export const getKnowledgeList = <LabelListProps, LabelListReturnProps>(data: LabelListProps) => {
  return get<LabelListReturnProps>('/label/query', data);
};