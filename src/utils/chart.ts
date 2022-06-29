import type { CommonReturnProps } from '@/services/statistics';
import type { ChartProps } from '@/services/common';
import dayjs from 'dayjs';
import { knowledgeFlag } from '@/constants/index';

/**
 * 处理图表数据格式
 * @param data 接口返回数据
 * @param params 接口查询参数
 * @returns promise 接口返回值
 */
export const generateChartData = (
  data: CommonReturnProps[],
  params: ChartProps,
  mapType?: 'flag',
) => {
  const xAxisData: string[] = [];
  const seriesData: number[] = [];
  data.forEach((item) => {
    if (params.timeType === '2') {
      const date = dayjs().set('month', Number(item.xAxisData)).format('YYYY-MM');
      xAxisData.push(date);
    } else {
      if (mapType === 'flag') {
        xAxisData.push(knowledgeFlag[item.xAxisData as unknown as keyof typeof knowledgeFlag]);
      } else {
        xAxisData.push(item.xAxisData);
      }
    }
    seriesData.push(item.num);
  });
  return {
    xAxisData,
    seriesData,
  };
};
