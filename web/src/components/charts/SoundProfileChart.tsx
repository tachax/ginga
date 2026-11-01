import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { SoundProfile } from '../../types';
import { COLORS, reduceMotion } from './chartTheme';

const SERIES_COLORS = [COLORS.green, COLORS.apricot];

const FEATURES = [
  { key: 'danceability', label: 'dance' },
  { key: 'valence', label: 'happiness' },
  { key: 'speechiness', label: 'speech' },
  { key: 'liveness', label: 'live' },
  { key: 'acousticness', label: 'acoustic' },
  { key: 'energy', label: 'energy' },
] as const;

type SoundProfileChartProps = {
  data: SoundProfile[];
};

export function SoundProfileChart({ data }: SoundProfileChartProps) {
  const option: EChartsOption = {
    animation: !reduceMotion,
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: COLORS.muted },
    },
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => Number(value).toFixed(2),
    },
    radar: {
      indicator: FEATURES.map((f) => ({ name: f.label, max: 1 })),
      center: ['50%', '46%'],
      radius: '62%',
      splitNumber: 4,
      axisName: { color: COLORS.muted, fontSize: 11 },
      splitArea: { show: false },
      splitLine: { lineStyle: { color: COLORS.grid } },
      axisLine: { lineStyle: { color: COLORS.grid } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'none',
        data: data.map((profile, i) => ({
          name: profile.genre,
          value: FEATURES.map((f) => profile[f.key]),
          lineStyle: { color: SERIES_COLORS[i], width: 2 },
          itemStyle: { color: SERIES_COLORS[i] },
          areaStyle: { color: SERIES_COLORS[i], opacity: 0.2 },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
