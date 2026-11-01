import { Layout, Menu } from "antd";
import { 
  AppstoreOutlined, 
  CustomerServiceOutlined, 
  DatabaseOutlined, 
  LineChartOutlined,
} from "@ant-design/icons";
import styles from './SideMenu.module.css';

export type PageKey = 'overview' | 'explore' | 'genres' | 'about';

type SideMenuProps = {
  page: PageKey;
  onChange: (page: PageKey) => void;
};

const items = [
  { key: 'overview', icon: <AppstoreOutlined />, label: 'Overview' },
  { key: 'explore', icon: <CustomerServiceOutlined />, label: 'Explore tracks' },
  { key: 'genres', icon: <LineChartOutlined />, label: 'Genres' },
  { key: 'about', icon: <DatabaseOutlined />, label: 'About the data' },
];

export function SideMenu({ page, onChange }: SideMenuProps) {
  return (
    <Layout.Sider width={240} theme="light" className={styles.sider}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className={`display ${styles.logoText}`}>ginga</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[page]}
          items={items}
          onClick={({ key }) => onChange(key as PageKey)}
        />

        <div className={styles.source}>
          <div className={styles.sourceLabel}>Source</div>
          <div className={styles.sourceTitle}>Spotify Tracks Dataset</div>
          <div className={styles.sourceHint}>Kaggle · CSV in Postgres</div>
        </div>
      </div>
    </Layout.Sider>
  )
}