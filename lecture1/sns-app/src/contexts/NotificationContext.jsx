import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import Toast from '../components/ui/Toast';

/**
 * NotificationContext
 *
 * 실시간 알림 및 메시지 상태 관리
 * - 읽지 않은 알림/메시지 카운트
 * - 실시간 구독
 * - 토스트 알림 표시
 */
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [toasts, setToasts] = useState([]);

  // 토스트 알림 추가
  const addToast = useCallback((notification) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...notification, id }]);
  }, []);

  // 토스트 알림 제거
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 읽지 않은 알림 수 조회
  const fetchUnreadNotifications = useCallback(async () => {
    if (!user) return;

    const { count } = await supabase
      .from('sns_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setUnreadNotifications(count || 0);
  }, [user]);

  // 읽지 않은 메시지 수 조회
  const fetchUnreadMessages = useCallback(async () => {
    if (!user) return;

    // 사용자가 참여한 채팅방 조회
    const { data: rooms } = await supabase
      .from('sns_chat_rooms')
      .select('id')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (!rooms || rooms.length === 0) {
      setUnreadMessages(0);
      return;
    }

    // 읽지 않은 메시지 수 조회
    const roomIds = rooms.map((r) => r.id);
    const { count } = await supabase
      .from('sns_messages')
      .select('*', { count: 'exact', head: true })
      .in('chat_room_id', roomIds)
      .neq('sender_id', user.id)
      .eq('is_read', false);

    setUnreadMessages(count || 0);
  }, [user]);

  // 알림 읽음 처리
  const markNotificationsAsRead = useCallback(async () => {
    if (!user) return;

    await supabase
      .from('sns_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setUnreadNotifications(0);
  }, [user]);

  // 특정 채팅방 메시지 읽음 처리
  const markMessagesAsRead = useCallback(async (chatRoomId) => {
    if (!user) return;

    await supabase
      .from('sns_messages')
      .update({ is_read: true })
      .eq('chat_room_id', chatRoomId)
      .neq('sender_id', user.id)
      .eq('is_read', false);

    fetchUnreadMessages();
  }, [user, fetchUnreadMessages]);

  // 초기 카운트 로드 및 실시간 구독
  useEffect(() => {
    if (!user) {
      setUnreadNotifications(0);
      setUnreadMessages(0);
      return;
    }

    fetchUnreadNotifications();
    fetchUnreadMessages();

    // 알림 실시간 구독
    const notificationChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sns_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // 카운트 증가
          setUnreadNotifications((prev) => prev + 1);

          // 알림 발신자 정보 조회
          const { data: actor } = await supabase
            .from('sns_users')
            .select('nickname, profile_image')
            .eq('id', payload.new.actor_id)
            .maybeSingle();

          // 알림 타입에 따른 메시지
          let title = '새로운 알림';
          let body = '';

          switch (payload.new.type) {
            case 'like':
              title = `${actor?.nickname || '누군가'}님이 좋아요를 눌렀습니다`;
              body = '게시물을 확인해보세요';
              break;
            case 'comment':
              title = `${actor?.nickname || '누군가'}님이 댓글을 남겼습니다`;
              body = '댓글을 확인해보세요';
              break;
            case 'follow':
              title = `${actor?.nickname || '누군가'}님이 팔로우했습니다`;
              body = '프로필을 확인해보세요';
              break;
            default:
              title = '새로운 알림이 있습니다';
          }

          addToast({
            type: 'notification',
            title,
            body,
            actorName: actor?.nickname,
            actorImage: actor?.profile_image,
          });
        }
      )
      .subscribe();

    // 메시지 실시간 구독
    const messageChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sns_messages',
        },
        async (payload) => {
          // 내가 보낸 메시지는 무시
          if (payload.new.sender_id === user.id) return;

          // 내가 참여한 채팅방인지 확인
          const { data: room } = await supabase
            .from('sns_chat_rooms')
            .select('user1_id, user2_id')
            .eq('id', payload.new.chat_room_id)
            .maybeSingle();

          if (!room) return;
          if (room.user1_id !== user.id && room.user2_id !== user.id) return;

          // 카운트 증가
          setUnreadMessages((prev) => prev + 1);

          // 발신자 정보 조회
          const { data: sender } = await supabase
            .from('sns_users')
            .select('nickname, profile_image')
            .eq('id', payload.new.sender_id)
            .maybeSingle();

          addToast({
            type: 'message',
            title: `${sender?.nickname || '누군가'}님의 메시지`,
            body: payload.new.content,
            actorName: sender?.nickname,
            actorImage: sender?.profile_image,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user, fetchUnreadNotifications, fetchUnreadMessages, addToast]);

  const value = {
    unreadNotifications,
    unreadMessages,
    fetchUnreadNotifications,
    fetchUnreadMessages,
    markNotificationsAsRead,
    markMessagesAsRead,
    addToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* 토스트 알림 렌더링 */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
