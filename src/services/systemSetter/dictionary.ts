import request, { get, post } from '@/utils/request';

interface DictionaryListProps {
  type: string;
}

interface DictionaryListItemType {
  children?: DictionaryListItemType[];
  deptName: string;
  id: string;
  parentId: string;
}

export type DictionaryReturnProps = DictionaryListItemType[];

export const getDictionaryList = <DictionaryListProps, DictionaryReturnProps>(
  data: DictionaryListProps,
) => {
  return get<DictionaryReturnProps>('/api/dict/tree/query', data);
};
