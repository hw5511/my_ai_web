import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';

/**
 * BottomNav 컴포넌트
 *
 * 하단 네비게이션 바 (fixed)
 * - 홈 (메인페이지)
 * - 검색 (검색 페이지)
 * - 게시물 업로드 (업로드 페이지)
 * - 프로필 (내 프로필 페이지)
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/search') return 1;
    if (path === '/upload') return 2;
    if (path.startsWith('/profile')) return 3;
    return 0;
  };

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/search');
        break;
      case 2:
        navigate('/upload');
        break;
      case 3:
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={handleChange}
        showLabels={false}
      >
        <BottomNavigationAction
          icon={getActiveTab() === 0 ? <HomeIcon /> : <HomeOutlinedIcon />}
        />
        <BottomNavigationAction
          icon={getActiveTab() === 1 ? <SearchIcon /> : <SearchOutlinedIcon />}
        />
        <BottomNavigationAction
          icon={<AddBoxOutlinedIcon />}
        />
        <BottomNavigationAction
          icon={getActiveTab() === 3 ? <PersonIcon /> : <PersonOutlineIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
