/**
 * 通用表格 组合式api
 * 此 api 是提取表格的显示和操作方法的公用性，
 * 实现了数据的加载加载，分页查询，条件筛选，表格多选，条件重置等功能，
 * 通过`getList`这个方法来加载数据，
 * props说明：
 * @param fetchData 接口api
 * @param formatParams 查询条件
 * @param formatResponse 接口返回{list:[], total: 0}
 * @param paginationOption 自定义的分页key值，默认[page, page_size]
 * 其他功能可查看代码使用
 */

import { reactive, toRefs, computed, ref, onActivated, unref } from 'vue';
import { removeNullItem } from '@/utils/utils';

interface FomartDataType {
  list: object[];
  total: number;
}

interface PaginationType {
  current: number;
  pageSize: number;
}

interface SorterType {
  field: string;
  order: string | undefined;
  columnKey?: string;
}

interface Props {
  fetchData: (params: Record<string, any>) => Promise<BaseReturnProps<Record<string, any>>>;
  formatParams: () => { [x: string]: any };
  formatResponse?: (data: any) => FomartDataType;
  paginationOption?: Array<string>;
  pageSize?: number;
  firstLoaded?: boolean;
}

interface BaseReturnProps<T> {
  records: T[];
  current: number;
  page: number;
  size: number;
  total: number;
}

interface StateType {
  dataSource: Record<string, any> | undefined;
  tableLoading: boolean;
  total: number;
  current: number;
  size: number;
  selectedRowKeys: string[];
}
const defaultSortedInfo = {
  field: '',
  order: undefined,
  columnKey: '',
};
export default function useSearchTableList(props: Props) {
  const {
    fetchData,
    formatParams,
    formatResponse,
    paginationOption = ['current', 'size'],
    pageSize = 20,
    firstLoaded = true,
  } = props;

  const searchFormRef = ref();
  const sortedInfo = ref<SorterType>(defaultSortedInfo);

  // 基础数据
  const STATE = reactive<StateType>({
    dataSource: [],
    tableLoading: false,
    total: 0,
    current: 1,
    size: pageSize,
    selectedRowKeys: [],
  });

  // 分页配置
  const pagination = computed(() => ({
    total: STATE.total,
    current: STATE.current,
    pageSize: STATE.size,
    showTotal: (total: number) => `共${total}条`,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page: number) => {
      STATE.current = page;
    },
    onShowSizeChange: (current: number, pageSize: number) => {
      STATE.current = 1;
      STATE.size = pageSize;
    },
  }));

  const rowSelection = computed(() => {
    return {
      selectedRowKeys: unref(STATE.selectedRowKeys),
      onChange: (selectedRowKeys: string[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, selectedRowKeys);
        STATE.selectedRowKeys = selectedRowKeys;
      },
    };
  });

  /**
   * 查询数据
   */
  const onSearch = () => {
    _checkSearchField().then(() => {
      STATE.current = 1;
      resertTable();
      getList();
    });
  };

  /**
   * 重置数据
   */
  const onReset = () => {
    searchFormRef.value.resetFields();
    STATE.current = 1;
    resertTable();
    getList();
  };

  /**
   * 获取数据列表
   */
  const getList = async () => {
    STATE.tableLoading = true;
    try {
      const newParams = formatParams();
      let [current, size] = paginationOption;
      const data = removeNullItem({
        [current]: STATE.current,
        [size]: STATE.size,
        sort_field: sortedInfo.value.field,
        sort_value: sortedInfo.value.order,
        ...newParams,
      });
      const res = await fetchData(data);
      STATE.tableLoading = false;
      if (formatResponse) {
        const { list, total } = await formatResponse(res);
        STATE.dataSource = list;
        STATE.total = total;
        return;
      }
      STATE.dataSource = res?.records ?? [];
      STATE.total = res?.total ?? 0;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 检查搜索条件验证
   * @param searchFormRef
   * @returns {Promise<unknown>}
   */

  const _checkSearchField = () => {
    return new Promise<void>((resolve, reject) => {
      searchFormRef.value
        .validate()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };

  /**
   * 表格排序，筛选
   */
  const onTableChange = (page: PaginationType, filters: any, sorter: SorterType) => {
    sortedInfo.value = sorter;
    getList();
  };

  const resertTable = () => {
    sortedInfo.value = defaultSortedInfo;
    STATE.selectedRowKeys = [];
  };

  onActivated(() => {
    firstLoaded && getList();
  });

  return {
    ...toRefs(STATE),
    onSearch,
    onReset,
    pagination,
    getList,
    searchFormRef,
    onTableChange,
    sortedInfo,
    rowSelection,
  };
}
