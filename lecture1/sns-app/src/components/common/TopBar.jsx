import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNotification } from '../../contexts/NotificationContext';

/**
 * TopBar 컴포넌트
 *
 * 메인 상단바 (fixed)
 * - 로고
 * - 알림 아이콘 (실시간 뱃지)
 * - 메시지 아이콘 (실시간 뱃지)
 */
function TopBar() {
  const navigate = useNavigate();
  const { unreadNotifications, unreadMessages } = useNotification();

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'primary.main',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Olive
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadNotifications} color="error" max={99}>
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={() => navigate('/messages')}>
            <Badge badgeContent={unreadMessages} color="error" max={99}>
              <ChatBubbleOutlineIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
