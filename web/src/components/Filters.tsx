import { useState } from 'react';
import { Card, Checkbox, Flex, Input, Slider, Tag } from 'antd';
import type { TrackFilters } from '../types';

const FEATURED_GENRES = ['reggaeton', 'samba', 'forro', 'salsa', 'pagode', 'mpb', 'k-pop', 'tango'];

const chipStyle = (checked: boolean) => ({
  borderRadius: 22,
  padding: '4px 14px',
  fontSize: 14,
  border: `1px solid ${checked ? 'transparent' : '#E1EADC'}`,
});

type FiltersProps = {
  value: TrackFilters;
  onChange: (next: TrackFilters) => void;
};

export function Filters({ value, onChange }: FiltersProps) {
  const [dance, setDance] = useState(value.minDance);

  // A genre picked on the Genres page may not be in the featured list: show it as a chip too.
  const genreChips =
    value.genre && !FEATURED_GENRES.includes(value.genre)
      ? [value.genre, ...FEATURED_GENRES]
      : FEATURED_GENRES;

  return (
    <Card>
      <Flex gap={24} align="center" wrap>
        <Input.Search
          size="large"
          allowClear
          placeholder="Search a song or artist"
          defaultValue={value.q}
          onSearch={(q) => onChange({ ...value, q })}
          style={{ flex: 1, minWidth: 240 }}
        />

        <Flex align="center" gap={12} style={{ minWidth: 300 }}>
          <span>Min. danceability</span>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={dance}
            onChange={setDance}
            onChangeComplete={(minDance) => onChange({ ...value, minDance })}
            style={{ flex: 1 }}
          />
          <span style={{ width: 32 }}>{dance.toFixed(2)}</span>
        </Flex>

        <Checkbox
          checked={value.hideExplicit}
          onChange={(e) => onChange({ ...value, hideExplicit: e.target.checked })}
        >
          Hide explicit
        </Checkbox>
      </Flex>

      <Flex gap={8} wrap style={{ marginTop: 16 }}>
        <Tag.CheckableTag
          checked={value.genre === null}
          onChange={() => onChange({ ...value, genre: null })}
          style={chipStyle(value.genre === null)}
        >
          All
        </Tag.CheckableTag>

        {genreChips.map((genre) => {
          const checked = value.genre === genre;
          return (
            <Tag.CheckableTag
              key={genre}
              checked={checked}
              onChange={() => onChange({ ...value, genre })}
              style={chipStyle(checked)}
            >
              {genre}
            </Tag.CheckableTag>
          );
        })}
      </Flex> 
    </Card>
  );
}
