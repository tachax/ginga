import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { GenreStat } from '../../types';
import { reduceMotion } from './chartTheme';

const GREEN_RAMP = [
  '#2E7D4F', '#3A8A5B', '#4A9868', '#5DA677',
  '#72B488', '#89C29B', '#A6D2B2', '#CFE8D5',
];

type TopGenresChartProps = {
  data: GenreStat[];
};

export function TopGenresChart({ data }: TopGenresChartProps) {
  const option: EChartsOption = {
    animation: !reduceMotion,
    grid: { left: 110, right: 40, top: 0, bottom: 0 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      valueFormatter: (value) => Number(value).toFixed(2),
    },
    xAxis: { type: 'value', max: 1, show: false },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        data: data.map((d) => d.genre),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#1D3B2A', fontSize: 13, align: 'left', margin: 110 },

      },
      {
        type: 'category',
        inverse: true,
        position: 'right',
        data: data.map((d) => d.value.toFixed(2)),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#1D3B2A', fontSize: 13, fontWeight: 600 },
      },
    ],
    series: [
      {
        type: 'bar',
        barWidth: 12,
        showBackground: true,
        backgroundStyle: { color: '#EEF4EA', borderRadius: 6 },
        itemStyle: { borderRadius: 6 },
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: { color: GREEN_RAMP[i] },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 280 }} />;
}
