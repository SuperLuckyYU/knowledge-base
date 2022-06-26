export interface ListBaseReturnProps<T> {
  records: T[];
  current: number;
  page: number;
  size: number;
  total: number;
}
