import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageSlider from '../components/ui/ImageSlider';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * PostDetailPage 컴포넌트
 *
 * 게시물 상세 페이지
 * - 게시물 이미지, 좋아요, 캡션
 * - 댓글 목록 및 입력
 */
function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const { data } = await supabase
        .from('sns_posts')
        .select(`
          *,
          user:sns_users(id, nickname, profile_image),
          images:sns_post_images(id, image_url, display_order)
        `)
        .eq('id', postId)
        .single();

      if (data) {
        data.images = data.images?.sort((a, b) => a.display_order - b.display_order);
        setPost(data);

        const { count } = await supabase
          .from('sns_likes')
          .select('*', { count: 'exact', head: true })
          .eq('target_type', 'post')
          .eq('target_id', postId);

        setLikeCount(count || 0);

        if (user) {
          const { data: likeData } = await supabase
            .from('sns_likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('target_type', 'post')
            .eq('target_id', postId)
            .maybeSingle();

          setIsLiked(!!likeData);
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('sns_comments')
        .select(`
          *,
          user:sns_users(id, nickname, profile_image)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('sns_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('target_type', 'post')
          .eq('target_id', postId);

        setLikeCount(likeCount - 1);
      } else {
        await supabase
          .from('sns_likes')
          .insert({ user_id: user.id, target_type: 'post', target_id: postId });

        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { data } = await supabase
        .from('sns_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select(`
          *,
          user:sns_users(id, nickname, profile_image)
        `)
        .single();

      if (data) {
        setComments([...comments, data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography>게시물을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={post.user?.profile_image}
            sx={{ width: 32, height: 32 }}
          >
            {post.user?.nickname?.[0]}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {post.user?.nickname}
          </Typography>
        </Box>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      {post.images && post.images.length > 0 && (
        <ImageSlider images={post.images} />
      )}

      <Container sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={handleLike} sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            좋아요 {likeCount}개
          </Typography>
        </Box>

        {post.caption && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 600, mr: 1 }}>
              {post.user?.nickname}
            </Typography>
            <Typography variant="body2" component="span">
              {post.caption}
            </Typography>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {formatTime(post.created_at)}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          댓글 {comments.length}개
        </Typography>

        <Box sx={{ mb: 2 }}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Avatar
                src={comment.user?.profile_image}
                sx={{ width: 32, height: 32, cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${comment.user?.id}`)}
              >
                {comment.user?.nickname?.[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box>
                  <Typography variant="body2" component="span" sx={{ fontWeight: 600, mr: 1 }}>
                    {comment.user?.nickname}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {comment.content}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(comment.created_at)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {user && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="댓글 달기..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button
              variant="text"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              게시
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PostDetailPage;
