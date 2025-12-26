import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Slide } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

/**
 * Toast 컴포넌트
 *
 * 실시간 알림을 화면 상단에 표시
 *
 * Props:
 * @param {object} notification - 알림 데이터 [Required]
 * @param {function} onClose - 토스트 닫힐 때 호출되는 함수 [Required]
 * @param {number} duration - 표시 시간(ms) [Optional, 기본값: 4000]
 */
function Toast({ notification, onClose, duration = 4000 }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isMessage = notification.type === 'message';

  return (
    <Slide direction="down" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 280,
          maxWidth: 360,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'divider',
        }}
        onClick={() => {
          setOpen(false);
          setTimeout(onClose, 300);
        }}
      >
        {notification.actorImage ? (
          <Avatar src={notification.actorImage} sx={{ width: 40, height: 40 }}>
            {notification.actorName?.[0]}
          </Avatar>
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: isMessage ? 'primary.main' : 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMessage ? (
              <ChatBubbleOutlineIcon sx={{ color: 'white', fontSize: 20 }} />
            ) : (
              <NotificationsIcon sx={{ color: 'white', fontSize: 20 }} />
            )}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {notification.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {notification.body}
          </Typography>
        </Box>
      </Box>
    </Slide>
  );
}

export default Toast;
