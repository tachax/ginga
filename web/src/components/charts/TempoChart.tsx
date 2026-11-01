import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { TempoBin } from '../../types';
import { COLORS, reduceMotion } from './chartTheme';

function barColor(tracks: number, max: number) {
  const ratio = tracks / max;
  if (ratio > 0.8) return COLORS.green;
  if (ratio > 0.5) return '#5DA677';
  return '#A6D2B2';
}

type TempoChartProps = {
  data: TempoBin[];
};

export function TempoChart({ data }: TempoChartProps) {
  const max = Math.max(...data.map((d) => d.tracks));

  const option: EChartsOption = {
    animation: !reduceMotion,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      valueFormatter: (value) => `${Number(value).toLocaleString('en-US')} tracks`,
    },
    grid: { left: 0, right: 0, top: 8, bottom: 24 },
    xAxis: {
      type: 'category',
      data: data.map((d) => String(d.bpm)),
      axisLine: { lineStyle: { color: COLORS.grid } },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.muted,
        interval: 2,
        formatter: (value: string) => (value === '180' ? '180+' : value),
      },
    },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'bar',
        barCategoryGap: '20%',
        itemStyle: { borderRadius: [6, 6, 0, 0] },
        data: data.map((d) => ({
          value: d.tracks,
          itemStyle: { color: barColor(d.tracks, max) },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 280 }} />;
}
