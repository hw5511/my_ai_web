import { Box } from '@mui/material';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

/**
 * MainLayout 컴포넌트
 *
 * 메인 레이아웃 (상단바 + 콘텐츠 영역 + 하단바)
 *
 * Props:
 * @param {ReactNode} children - 페이지 콘텐츠 [Required]
 * @param {boolean} hideTopBar - 상단바 숨김 여부 [Optional, 기본값: false]
 * @param {boolean} hideBottomNav - 하단바 숨김 여부 [Optional, 기본값: false]
 */
function MainLayout({ children, hideTopBar = false, hideBottomNav = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      {!hideTopBar && <TopBar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: hideTopBar ? 0 : '56px',
          pb: hideBottomNav ? 0 : '56px',
        }}
      >
        {children}
      </Box>

      {!hideBottomNav && <BottomNav />}
    </Box>
  );
}

export default MainLayout;
