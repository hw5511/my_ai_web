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
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * MessagesPage 컴포넌트
 *
 * 메시지 목록 페이지
 * - 채팅방 목록
 * - 새 대화 시작
 */
function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user]);

  const fetchChatRooms = async () => {
    try {
      const { data } = await supabase
        .from('sns_chat_rooms')
        .select(`
          *,
          user1:sns_users!user1_id(id, nickname, profile_image),
          user2:sns_users!user2_id(id, nickname, profile_image)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      const roomsWithLastMessage = await Promise.all(
        (data || []).map(async (room) => {
          const { data: lastMessage } = await supabase
            .from('sns_messages')
            .select('content, created_at')
            .eq('chat_room_id', room.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const otherUser = room.user1_id === user.id ? room.user2 : room.user1;

          return {
            ...room,
            otherUser,
            lastMessage,
          };
        })
      );

      setChatRooms(roomsWithLastMessage.filter((r) => r.lastMessage));
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2">메시지</Typography>
        </Box>
        <IconButton onClick={() => navigate('/messages/new')}>
          <EditOutlinedIcon />
        </IconButton>
      </Box>

      <Container>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : chatRooms.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              아직 대화가 없습니다
            </Typography>
            <Button variant="contained" onClick={() => navigate('/messages/new')}>
              대화 시작하기
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            {chatRooms.map((room) => (
              <ListItem
                key={room.id}
                sx={{ px: 0, cursor: 'pointer' }}
                onClick={() => navigate(`/chat/${room.id}`)}
              >
                <ListItemAvatar>
                  <Avatar src={room.otherUser?.profile_image}>
                    {room.otherUser?.nickname?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={room.otherUser?.nickname}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                        {room.lastMessage?.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(room.lastMessage?.created_at)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}

export default MessagesPage;
