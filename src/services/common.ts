import request, { get, post } from '@/utils/request';
import { number } from 'vue-types';
export interface ListBaseReturnProps<T> {
  records: T[];
  current: number;
  page: number;
  size: number;
  total: number;
}

export interface ChartProps {
  timeType: string;
  startTime?: string;
  endTime?: string;
}

export interface PostDownloadLogProps {
  accessoryName?: string;
  knowledgeId: string;
  logType: 0 | 1;
}

// 上报分享或下载日志
export const postDownloadLog = (data: PostDownloadLogProps) => {
  return post<boolean>('/base/tail/log/save', data);
};

export interface DownloadLogListItemType {
  accessoryName: string;
  crateTime: string;
  id: number;
  knowledgeId: number;
  logType: string;
  userId: number;
  userName: string;
}

// 获取分享或下载日志
export const getDownloadLog = (data: { knowledgeId?: string; logType?: number }) => {
  return get<ListBaseReturnProps<DownloadLogListItemType>>('/base/tail/log/query', data);
};
