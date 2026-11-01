import { useState } from 'react';
import { ConfigProvider, Layout, type ThemeConfig } from 'antd';
import { SideMenu, type PageKey } from './components/SideMenu';
import { HeroHeader } from './components/HeroHeader';
import { useApi } from './hooks/useApi';
import type { Summary } from './types';
import { Overview } from './pages/Overview';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#2E7D4F',
    colorText: '#1D3B2A',
    colorTextSecondary: '#557063',
    colorBgLayout: '#F3F7EF',
    colorBorderSecondary: '#E1EADC',
    borderRadius: 16,
    fontFamily: 'Figtree, system-ui, sans-serif',
  },
  components: {
    Menu: {
      itemSelectedBg: '#DDF0E1',
      itemSelectedColor: '#2E7D4F',
      itemBorderRadius: 16,
      activeBarBorderWidth: 0,
    },
    Input: { borderRadiusLG: 22 },
    Select: { borderRadiusLG: 22 },
    Card: { borderRadiusLG: 22 },
  },
};

function App() {
  const [page, setPage] = useState<PageKey>('overview');
  const summary = useApi<Summary>('/api/stats/summary');

  return (
    <ConfigProvider theme={theme}>
      <Layout hasSider style={{ minHeight: '100vh' }}>
        <SideMenu page={page} onChange={setPage} />
        <Layout.Content style={{ padding: '24px 24px 24px 0' }}>
          {page === 'overview' ? <Overview /> : <p>Coming soon: {page}</p>}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
