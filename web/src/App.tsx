import { useState, ReactNode } from 'react';
import { ConfigProvider, Layout, type ThemeConfig } from 'antd';
import { SideMenu, type PageKey } from './components/SideMenu';
import { Overview } from './pages/Overview';
import { Explore } from './pages/Explore';

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
    Card: { borderRadiusLG: 22, headerFontSize: 20 },
    Checkbox: { borderRadiusSM: 4 },
  },
};

const PAGES: Partial<Record<PageKey, ReactNode>> = {
  overview: <Overview />,
  explore: <Explore />,
};

function App() {
  const [page, setPage] = useState<PageKey>('overview');

  return (
    <ConfigProvider theme={theme}>
      <Layout hasSider style={{ minHeight: '100vh' }}>
        <SideMenu page={page} onChange={setPage} />
        <Layout.Content style={{ padding: '24px 24px 24px 0' }}>
          {PAGES[page] ?? <p>Coming soon: {page}</p>}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
