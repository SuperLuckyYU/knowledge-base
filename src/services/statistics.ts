import request, { get, post } from '@/utils/request';

export interface ListBaseReturnProps<T> {
  code: number;
  data: T[];
  message: string;
}

interface KnowledgeNumberReturnProps {
  dictName: string;
  num: number;
}

export const getKnowledgeNumber = () => {
  return get<ListBaseReturnProps<KnowledgeNumberReturnProps>>(
    '/dict/statistics/type/knowledge/number',
  );
};
