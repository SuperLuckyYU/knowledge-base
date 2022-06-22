import request, { get, post } from '@/utils/request';

export interface DictionaryListProps {
  type: string;
}

export interface DictionaryListItemType {
  children?: DictionaryListItemType[];
  deptName: string;
  id: string;
  parentId: string;
}

export type DictionaryReturnProps = DictionaryListItemType[];

export const getDictionaryList = <DictionaryListProps, DictionaryReturnProps>(
  data: DictionaryListProps,
) => {
  return get<DictionaryReturnProps>('/dict/tree/query', data);
};
