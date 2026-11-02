import { useState } from 'react';
import { ConfigProvider, Grid, Layout, type ThemeConfig } from 'antd';
import { SideMenu, type PageKey } from './components/SideMenu';
import { MobileHeader } from './components/MobileHeader';
import { MobileTabBar } from './components/MobileTabBar';
import { Overview } from './pages/Overview';
import { Explore } from './pages/Explore';
import { Genres } from './pages/Genres';
import { About } from './pages/About';

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
    Segmented: {
      itemSelectedBg: '#2E7D4F',
      itemSelectedColor: '#FFFFFF',
      trackBg: '#FFFFFF',
      trackPadding: 4,
      borderRadius: 22,
      borderRadiusSM: 18,
    },
  },
};

function App() {
  const [page, setPage] = useState<PageKey>('overview');
  const [exploreGenre, setExploreGenre] = useState<string | null>(null);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  // Menu / tab bar navigation starts Explore without a preset genre.
  function navigate(next: PageKey) {
    setExploreGenre(null);
    setPage(next);
  }

  // "Explore samba tracks →" on the Genres page.
  function openExplore(genre: string) {
    setExploreGenre(genre);
    setPage('explore');
  }

  function renderPage() {
    switch (page) {
      case 'overview':
        return <Overview />;
      case 'explore':
        return <Explore initialGenre={exploreGenre} />;
      case 'genres':
        return <Genres onExploreGenre={openExplore} />;
      case 'about':
        return <About />;
    }
  }

  return (
    <ConfigProvider theme={theme}>
      <Layout hasSider={!isMobile} style={{ minHeight: '100vh' }}>
        {!isMobile && <SideMenu page={page} onChange={navigate} />}
        <Layout.Content
          style={{ padding: isMobile ? '0 16px 96px' : '24px 24px 24px 0' }}
        >
          {isMobile && <MobileHeader onSearch={() => navigate('explore')} />}
          {renderPage()}
        </Layout.Content>
        {isMobile && <MobileTabBar page={page} onChange={navigate} />}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
