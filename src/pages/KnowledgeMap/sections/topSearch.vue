<template>
  <div ref="wordCloud" class="top-search mt15"></div>
</template>

<script lang="ts" setup>
import { init } from 'echarts/core';
import { ref, onMounted } from 'vue';
import { getLabelList } from '@/services/systemSetter/label';

const wordCloud = ref<HTMLElement>();

onMounted(async () => {
  if (wordCloud.value) {
    const { records } = await getLabelList({ current: 1, size: 20 });
    const chart = init(wordCloud.value);
    const keywords = records.map((item) => ({
      name: item.labelName,
      value: item.knowledgeNum,
    }));

    const option = {
      series: [
        {
          type: 'wordCloud',
          sizeRange: [15, 40],
          rotationRange: [0, 0],
          rotationStep: 45,
          gridSize: 8,
          shape: 'pentagon',
          width: '100%',
          height: '100%',
          textStyle: {
            color: function () {
              return (
                'rgb(' +
                [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                ].join(',') +
                ')'
              );
            },
            emphasis: {
              focus: 'self',
              textStyle: {
                textShadowBlur: 10,
                textShadowColor: '#333',
              },
            },
          },
          data: keywords,
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    chart.setOption(option);
    window.addEventListener('resize', function () {
      chart.resize();
    });
  }
});
</script>

<style lang="less" scoped>
.chart {
  height: 400px;
}
.top-search {
  width: 100%;
  height: 200px;
}
</style>
