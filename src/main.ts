import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
import 'echarts-wordcloud/dist/echarts-wordcloud';
import App from './App.vue';
import Clipboard from './plugins/clipboard';
import DownloadFile from './plugins/DownloadFile';
import 'ant-design-vue/dist/antd.css';
import router from '@/router/index';
import permission from '@/router/permission';
import { setupStore } from './store';
import './global.less';

import { CanvasRenderer } from 'echarts/renderers';

import { BarChart, PieChart, LineChart } from 'echarts/charts';

import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';

(async () => {
  use([
    CanvasRenderer,
    BarChart,
    PieChart,
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
  ]);

  const app = createApp(App);
  setupStore(app);
  permission();
  app.use(Antd).use(router).use(Clipboard).use(DownloadFile).mount('#app');
  app.component('v-chart', ECharts);
})();
