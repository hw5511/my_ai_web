import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

/**
 * ChatRoomPage 컴포넌트
 *
 * 채팅방 페이지
 * - 실시간 메시지 송수신
 */
function ChatRoomPage() {
  const { chatRoomId, userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { markMessagesAsRead } = useNotification();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [roomId, setRoomId] = useState(chatRoomId);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (chatRoomId) {
        fetchChatRoom();
      } else if (userId) {
        findOrCreateRoom();
      }
    }
  }, [user, chatRoomId, userId]);

  // 채팅방 메시지 읽음 처리
  useEffect(() => {
    if (roomId) {
      markMessagesAsRead(roomId);
    }
  }, [roomId, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatRoom = async () => {
    try {
      const { data: room } = await supabase
        .from('sns_chat_rooms')
        .select(`
          *,
          user1:sns_users!user1_id(id, nickname, profile_image),
          user2:sns_users!user2_id(id, nickname, profile_image)
        `)
        .eq('id', chatRoomId)
        .single();

      if (room) {
        setOtherUser(room.user1_id === user.id ? room.user2 : room.user1);
        fetchMessages(chatRoomId);
      }
    } catch (error) {
      console.error('Error fetching chat room:', error);
    } finally {
      setLoading(false);
    }
  };

  const findOrCreateRoom = async () => {
    try {
      const { data: otherUserData } = await supabase
        .from('sns_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (otherUserData) {
        setOtherUser(otherUserData);
      }

      const { data: existingRoom } = await supabase
        .from('sns_chat_rooms')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${user.id})`)
        .maybeSingle();

      if (existingRoom) {
        setRoomId(existingRoom.id);
        fetchMessages(existingRoom.id);
      }
    } catch (error) {
      console.error('Error finding room:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const { data } = await supabase
        .from('sns_messages')
        .select('*')
        .eq('chat_room_id', id)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      let currentRoomId = roomId;

      if (!currentRoomId) {
        const { data: newRoom } = await supabase
          .from('sns_chat_rooms')
          .insert({
            user1_id: user.id,
            user2_id: userId,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        currentRoomId = newRoom.id;
        setRoomId(currentRoomId);
      }

      const { data: message } = await supabase
        .from('sns_messages')
        .insert({
          chat_room_id: currentRoomId,
          sender_id: user.id,
          content: newMessage.trim(),
        })
        .select()
        .single();

      await supabase
        .from('sns_chat_rooms')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentRoomId);

      if (message) {
        setMessages([...messages, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
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
        <Avatar src={otherUser?.profile_image} sx={{ width: 36, height: 36 }}>
          {otherUser?.nickname?.[0]}
        </Avatar>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {otherUser?.nickname}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender_id === user.id ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                p: 1.5,
                borderRadius: 2,
                bgcolor: message.sender_id === user.id ? 'primary.main' : 'grey.200',
                color: message.sender_id === user.id ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="body2">{message.content}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {formatTime(message.created_at)}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <TextField
          fullWidth
          placeholder="메시지 입력..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSend} disabled={!newMessage.trim()}>
                  <SendIcon color={newMessage.trim() ? 'primary' : 'disabled'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}

export default ChatRoomPage;
