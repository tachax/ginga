import type { ReactNode } from 'react';
import {
  AppstoreOutlined,
  CustomerServiceOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { PageKey } from './SideMenu';
import styles from './MobileTabBar.module.css';

const TABS: { key: PageKey; label: string; icon: ReactNode }[] = [
  { key: 'overview', label: 'Home', icon: <AppstoreOutlined /> },
  { key: 'explore', label: 'Explore', icon: <CustomerServiceOutlined /> },
  { key: 'genres', label: 'Genres', icon: <LineChartOutlined /> },
];

type MobileTabBarProps = {
  page: PageKey;
  onChange: (page: PageKey) => void;
};

export function MobileTabBar({ page, onChange }: MobileTabBarProps) {
  return (
    <nav className={styles.bar} aria-label="Main">
      {TABS.map((tab) => {
        const active = page === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            className={`${styles.tab} ${active ? styles.active : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(tab.key)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
