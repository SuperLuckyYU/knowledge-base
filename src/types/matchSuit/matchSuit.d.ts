import { Dayjs } from 'dayjs';
export interface FormStateType {
  sku: string;
  name: string;
  category: string[];
  status: string;
  date: Dayjs[];
}