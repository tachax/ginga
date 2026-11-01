import { useState } from 'react';
import { Flex, Select } from 'antd';
import { ChartCard } from './ChartCard';
import { SoundProfileChart } from './charts/SoundProfileChart';
import { useApi } from '../hooks/useApi';
import type { SoundProfile } from '../types';

export function SoundProfileCard() {
  const [a, setA] = useState('samba');
  const [b, setB] = useState('tango');

  const genres = useApi<string[]>('/api/genres');
  const profile = useApi<SoundProfile[]>(
    `/api/genres/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`,
  );

  const optionsExcept = (taken: string) =>
    (genres.data ?? []).map((g) => ({ value: g, label: g, disabled: g === taken }));

  return (
    <ChartCard
      title="Sound profile"
      subtitle={`${a} vs. ${b}`}
      loading={profile.loading && !profile.data}
      error={profile.error}
    >
      <Flex gap={8} align="center">
        <Select
          showSearch
          value={a}
          onChange={setA}
          options={optionsExcept(b)}
          loading={genres.loading}
          style={{ flex: 1 }}
        />
        <span>vs.</span>
        <Select
          showSearch
          value={b}
          onChange={setB}
          options={optionsExcept(a)}
          loading={genres.loading}
          style={{ flex: 1 }}
        />
      </Flex>
      <SoundProfileChart data={profile.data ?? []} />
    </ChartCard>
  );
}
