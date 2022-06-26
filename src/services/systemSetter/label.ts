import request, { get, post } from '@/utils/request';
import type { ListBaseReturnProps } from '@/services/common';
export interface LabelItemType {
  id: string;
  labelName: string;
  updateTime: string;
  labelCreator: string;
}

interface LabelListProps {
  labelName?: string;
}

export interface LabelListReturnProps {
  createTime: string;
  id: string;
  knowledgeNum: string;
  labelCreator: string;
  labelName: string;
  updateTime: string;
}

export type CommonOpreateReturnType = boolean;

export const getLabelList = (data: LabelListProps) => {
  return get<ListBaseReturnProps<LabelListReturnProps>>('/label/query', data);
};

export interface CreateLabelProps {
  labelName: string;
}

export interface UpdateLabelProps extends CreateLabelProps {
  id: string;
}

export const createLabel: {
  (data: CreateLabelProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return post('/label/save', data);
};

export const updateLabel: {
  (data: UpdateLabelProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return post('/label/update', data);
};

interface DelProps {
  ids: string;
}

export const delLabel: {
  (data: DelProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return get('/label/del', data);
};
