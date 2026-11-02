import { Tag } from 'antd';

type GenreTagProps = {
  genre: string;
};

export function GenreTag({ genre }: GenreTagProps) {
  return (
    <Tag style={{ background: '#DDF0E1', color: '#2E7D4F', border: 'none' }}>{genre}</Tag>
  );
}
