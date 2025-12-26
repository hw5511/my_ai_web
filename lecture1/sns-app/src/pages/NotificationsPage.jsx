import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

/**
 * NotificationsPage 컴포넌트
 *
 * 알림 페이지
 * - 좋아요, 팔로우, 댓글 알림
 */
function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { markNotificationsAsRead } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      markNotificationsAsRead();
    }
  }, [user, markNotificationsAsRead]);

  const fetchNotifications = async () => {
    try {
      const { data } = await supabase
        .from('sns_notifications')
        .select(`
          *,
          actor:sns_users!actor_id(id, nickname, profile_image)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return '님이 회원님의 게시물을 좋아합니다.';
      case 'comment':
        return '님이 댓글을 남겼습니다.';
      case 'follow':
        return '님이 회원님을 팔로우하기 시작했습니다.';
      default:
        return '';
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.actor?.id}`);
    } else if (notification.target_id) {
      navigate(`/post/${notification.target_id}`);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2">알림</Typography>
      </Box>

      <Container>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            아직 알림이 없습니다
          </Typography>
        ) : (
          <List disablePadding>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  px: 0,
                  cursor: 'pointer',
                  bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItemAvatar>
                  <Avatar src={notification.actor?.profile_image}>
                    {notification.actor?.nickname?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box component="span">
                      <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
                        {notification.actor?.nickname}
                      </Typography>
                      <Typography component="span" variant="body2">
                        {getNotificationText(notification)}
                      </Typography>
                    </Box>
                  }
                  secondary={formatTime(notification.created_at)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}

export default NotificationsPage;
