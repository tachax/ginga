import { useState, type ReactNode } from 'react';
import { ConfigProvider, Grid, Layout, type ThemeConfig } from 'antd';
import { SideMenu, type PageKey } from './components/SideMenu';
import { MobileHeader } from './components/MobileHeader';
import { MobileTabBar } from './components/MobileTabBar';
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
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  return (
    <ConfigProvider theme={theme}>
      <Layout hasSider={!isMobile} style={{ minHeight: '100vh' }}>
        {!isMobile && <SideMenu page={page} onChange={setPage} />}
        <Layout.Content
          style={{ padding: isMobile ? '0 16px 96px' : '24px 24px 24px 0' }}
        >
          {isMobile && <MobileHeader onSearch={() => setPage('explore')} />}
          {PAGES[page] ?? <p>Coming soon: {page}</p>}
        </Layout.Content>
        {isMobile && <MobileTabBar page={page} onChange={setPage} />}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
