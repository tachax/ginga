import ReactECharts from 'echarts-for-react';
import { format, type EChartsOption } from 'echarts';
import type { MoodPoint } from '../../types';
import { COLORS, reduceMotion } from './chartTheme';

const GROUPS = [
  { name: 'latin & caribbean', color: COLORS.green },
  { name: 'electronic', color: COLORS.apricot },
  { name: 'hip-hop', color: COLORS.blue },
  { name: 'others', color: COLORS.neutral },
];

const hiddenAxis = {
  type: 'value' as const,
  min: 0,
  max: 1,
  interval: 0.5,
  nameLocation: 'middle' as const,
  nameTextStyle: { color: COLORS.muted, fontSize: 11 },
  axisLabel: { show: false },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { type: 'dashed' as const, color: COLORS.grid } },
};

const corner = (text: string, position: Record<string, number>) => ({
  type: 'text' as const,
  ...position,
  style: { text, fill: COLORS.muted, fontSize: 11 },
});

type MoodMapChartProps = {
  data: MoodPoint[];
};

export function MoodMapChart({ data }: MoodMapChartProps) {
  const option: EChartsOption = {
    animation: !reduceMotion,
    grid: { left: 28, right: 8, top: 8, bottom: 60, show: true, backgroundColor: COLORS.plotBg, borderWidth: 0 },
    legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { color: COLORS.muted } },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const p = params as unknown as { name: string; value: number[] };
        return `<b>${format.encodeHTML(p.name)}</b><br/>
          energy ${p.value[0].toFixed(2)} · happiness ${p.value[1].toFixed(2)}`;
      },
    },
    xAxis: { ...hiddenAxis, name: 'energy →', nameGap: 12 },
    yAxis: { ...hiddenAxis, name: 'happiness →', nameGap: 12 },
    graphic: [
      corner('calm', { left: 36, top: 14 }),
      corner('euphoric', { right: 14, top: 14 }),
      corner('melancholic', { left: 36, bottom: 66 }),
      corner('intense', { right: 14, bottom: 66 }),
    ],
    series: GROUPS.map((group) => ({
      type: 'scatter' as const,
      name: group.name,
      itemStyle: { color: group.color, opacity: 0.75 },
      symbolSize: (value: number[]) => 4 + value[2] / 12,
      data: data
        .filter((d) => d.group === group.name)
        .map((d) => ({ name: d.name, value: [d.energy, d.valence, d.popularity] })),
    })),
  };

  return <ReactECharts option={option} style={{ height: 280 }} />;
}
