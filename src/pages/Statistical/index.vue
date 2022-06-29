<template>
  <a-card>
    <a-radio-group class="mb50 mr10" v-model:value="dateType">
      <a-radio-button value="0">本周</a-radio-button>
      <a-radio-button value="1">本月</a-radio-button>
      <a-radio-button value="2">本年</a-radio-button>
      <a-radio-button value="3">自定义时间范围</a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-if="dateType === '3'"
      v-model:value="dateRange"
      :format="dateFormat"
      :value-format="dateFormat"
      valueFormat="YYYY-MM-DD"
    />
    <a-row class="mb24">
      <a-col :span="12">
        <v-chart class="chart" :option="countStatisticalOption" />
      </a-col>
      <a-col :span="12">
        <v-chart class="chart" :option="countTrendOption" />
      </a-col>
    </a-row>
    <a-row class="mb24">
      <a-col :span="12">
        <v-chart class="chart" :option="typeCountStatisticalOption" />
      </a-col>
      <a-col :span="12">
        <v-chart class="chart" :option="typeCountTrendOption" />
      </a-col>
    </a-row>
    <a-row class="mb24">
      <a-col :span="24">
        <div class="title mb15">热门排行榜</div>
        <a-table :columns="columns" :data-source="topData" bordered :pagination="false">
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'knowledgeName'">
              <router-link :to="{ name: 'ArticleDetail', query: { id: record.id } }">{{
                text
              }}</router-link>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-row class="mb24">
      <a-col :span="12">
        <div class="title mb15">员工贡献排行榜</div>
        <a-table
          :columns="employeeContributionRankingColumns"
          :data-source="employeeContributionData"
          bordered
          :pagination="false"
        >
        </a-table>
      </a-col>
      <a-col :span="12">
        <v-chart class="chart" :option="departmentContributionOption" />
      </a-col>
    </a-row>
    <a-row class="mb24">
      <a-col :span="12">
        <div class="title mb15">标签统计</div>
        <top-search />
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts">
export default {
  name: 'Statistical',
};
</script>
<script lang="ts" setup>
import type { ChartProps } from '@/services/common';
import { onMounted, ref, reactive, watchEffect } from 'vue';
import dayjs from 'dayjs';
import TopSearch from '../KnowledgeMap/sections/topSearch.vue';
import useKnowledgeCountStatistic from './composables/useKnowledgeCountStatistic';
import useKnowledgeCountTrend from './composables/useKnowledgeCountTrend';
import useKnowledgeTypeCountStatistic from './composables/useKnowledgeTypeCountStatistic';
import useKnowledgeTypeCountTrend from './composables/useKnowledgeTypeCountTrend';
import useHotRanking from './composables/useHotRanking';
import useEmployeeContributionRanking from './composables/useEmployeeContributionRanking';
import useDepartmentContribution from './composables/useDepartmentContribution';

const dateType = ref('0');

const dateFormat = 'YYYY-MM-DD';
const startDate = dayjs().startOf('month').format(dateFormat);
const endDate = dayjs().endOf('month').format(dateFormat);
const dateRange = ref<[string, string]>([startDate, endDate]);

const { countStatisticalOption, fetchKnowledgeNumber } = useKnowledgeCountStatistic();
const { countTrendOption, fetchDateRangeCount } = useKnowledgeCountTrend();
const { typeCountStatisticalOption, fetchKnowledgeTypeNumber } = useKnowledgeTypeCountStatistic();
const { typeCountTrendOption, fetchDateRangeTypeCount } = useKnowledgeTypeCountTrend();
const { columns, topData, fetchTopData } = useHotRanking();
const {
  employeeContributionRankingColumns,
  employeeContributionData,
  fetchEmployeeContributionData,
} = useEmployeeContributionRanking();
const { departmentContributionOption, fetchDepartmentContributionData } =
  useDepartmentContribution();

const fetchData = (params: ChartProps) => {
  fetchKnowledgeNumber(params);
  fetchDateRangeCount(params);
  fetchKnowledgeTypeNumber(params);
  // fetchDateRangeTypeCount()
  fetchTopData();
  fetchEmployeeContributionData(params);
  // fetchDepartmentContributionData()
};

watchEffect(() => {
  const params = reactive<ChartProps>({
    timeType: dateType.value,
  });
  if (dateType.value === '3') {
    params.startTime = dateRange.value[0];
    params.endTime = dateRange.value[1];
  }
  fetchData(params);
});
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
}
.chart {
  height: 400px;
}
</style>
