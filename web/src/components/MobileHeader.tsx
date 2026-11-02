import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Logo } from './Logo';
import styles from './MobileHeader.module.css';

type MobileHeaderProps = {
  onSearch: () => void;
};

export function MobileHeader({ onSearch }: MobileHeaderProps) {
  return (
    <header className={styles.header}>
      <Logo />
      <Button
        shape="circle"
        size="large"
        icon={<SearchOutlined />}
        aria-label="Search tracks"
        onClick={onSearch}
      />
    </header>
  );
}
