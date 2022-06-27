import request, { get, post } from '@/utils/request';

export interface DictionaryListProps {
  type: string;
}

export interface DictionaryListItemType {
  children?: DictionaryListItemType[];
  dictName: string;
  id: string;
  parentId: string;
}

export type DictionaryReturnProps = DictionaryListItemType[];

export const getDictionaryList: {
  (data: DictionaryListProps): Promise<DictionaryReturnProps>;
} = (data) => {
  return get('/dict/tree/query', data);
};

export type CommonOpreateReturnType = boolean;

interface CreateProps {
  dictName: string;
  dictPid: string;
  dictType: string;
}

export const createDictionary: {
  (data: CreateProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return post('/dict/add', data);
};

interface UpdateProps {
  id: string;
  dictName: string;
  dictType: string;
}

export const updateDictionary: {
  (data: UpdateProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return post('/dict/update', data);
};

interface DelProps {
  id: string;
}

export const delDictionary: {
  (data: DelProps): Promise<CommonOpreateReturnType>;
} = (data) => {
  return get('/dict/del', data);
};
