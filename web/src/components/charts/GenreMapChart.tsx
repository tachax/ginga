import ReactECharts from 'echarts-for-react';
import { format, type EChartsOption } from 'echarts';
import type { GenreStat } from '../../types';
import { COLORS, reduceMotion } from './chartTheme';

const axisStyle = {
  type: 'value' as const,
  scale: true,
  splitNumber: 2,
  nameLocation: 'middle' as const,
  nameGap: 12,
  nameTextStyle: { color: COLORS.muted, fontSize: 11 },
  axisLabel: { show: false },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { type: 'dashed' as const, color: COLORS.grid } },
};

type GenreMapChartProps = {
  data: GenreStat[];
  selected: string | null;
  onSelect: (genre: string) => void;
};

export function GenreMapChart({ data, selected, onSelect }: GenreMapChartProps) {
  const option: EChartsOption = {
    animation: !reduceMotion,
    grid: {
      left: 28,
      right: 12,
      top: 12,
      bottom: 28,
      show: true,
      backgroundColor: COLORS.plotBg,
      borderWidth: 0,
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const p = params as unknown as { name: string; value: number[] };
        return `<b>${format.encodeHTML(p.name)}</b><br/>
          energy ${p.value[0].toFixed(2)} · danceability ${p.value[1].toFixed(2)}`;
      },
    },
    xAxis: { ...axisStyle, name: 'energy →' },
    yAxis: { ...axisStyle, name: 'danceability →' },
    series: [
      {
        type: 'scatter',
        cursor: 'pointer',
        data: data.map((d) => {
          const isSelected = d.genre === selected;
          return {
            name: d.genre,
            value: [d.energy, d.danceability],
            symbolSize: isSelected ? 16 : 10,
            itemStyle: { color: isSelected ? COLORS.green : '#A6D2B2' },
          };
        }),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 240 }}
      onEvents={{ click: (params: { name: string }) => onSelect(params.name) }}
    />
  );
}
