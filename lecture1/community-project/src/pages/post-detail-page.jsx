import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { supabase } from '../lib/supabase';

/**
 * PostDetailPage 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인한 사용자 정보 [Required]
 *
 * Example usage:
 * <PostDetailPage user={currentUser} />
 */
function PostDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLiked = likes.some((like) => like.user_id === user?.id);
  const likeCount = likes.length;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      // 게시물 조회
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          users (username)
        `)
        .eq('id', id)
        .single();

      if (postError) {
        console.error('Error fetching post:', postError);
        setIsLoading(false);
        return;
      }

      setPost(postData);

      // 댓글 조회
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          users (username)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      setComments(commentsData || []);

      // 좋아요 조회
      const { data: likesData } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', id);

      setLikes(likesData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleLikeClick = async () => {
    if (!post) return;

    try {
      if (isLiked) {
        // 좋아요 취소
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        setLikes((prev) => prev.filter((like) => like.user_id !== user.id));
      } else {
        // 좋아요 추가
        const { data } = await supabase
          .from('likes')
          .insert([{ post_id: post.id, user_id: user.id }])
          .select()
          .single();

        if (data) {
          setLikes((prev) => [...prev, data]);
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            content: commentText.trim(),
            post_id: post.id,
            author_id: user.id,
          },
        ])
        .select(`
          *,
          users (username)
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        setIsSubmitting(false);
        return;
      }

      setComments((prev) => [...prev, data]);
      setCommentText('');
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'rgba(20, 20, 20, 0.9)',
          }}
        >
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            게시물을 찾을 수 없습니다.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
          >
            목록으로 돌아가기
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="md">
        {/* 뒤로가기 버튼 */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            mb: 2,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              background: 'rgba(0, 255, 136, 0.1)',
            },
          }}
        >
          목록으로
        </Button>

        {/* 게시물 영역 */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 3,
            background: 'rgba(20, 20, 20, 0.9)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
          }}
        >
          {/* 제목 */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            {post.title}
          </Typography>

          {/* 작성자 정보 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {post.users?.username || '알 수 없음'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formatDate(post.created_at)}
              </Typography>
            </Box>
          </Box>

          {/* 게시물 내용 */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              minHeight: '150px',
              mb: 3,
            }}
          >
            {post.content}
          </Typography>

          {/* 좋아요 버튼 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pt: 2,
              borderTop: '1px solid rgba(0, 255, 136, 0.1)',
            }}
          >
            <IconButton
              onClick={handleLikeClick}
              sx={{
                color: isLiked ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  background: 'rgba(0, 255, 136, 0.1)',
                },
              }}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: isLiked ? 'primary.main' : 'text.secondary',
                fontWeight: 600,
              }}
            >
              {likeCount}
            </Typography>
          </Box>
        </Paper>

        {/* 댓글 영역 */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            background: 'rgba(20, 20, 20, 0.9)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
          >
            댓글 {comments.length}
          </Typography>

          {/* 댓글 입력란 */}
          <Box
            component="form"
            onSubmit={handleCommentSubmit}
            sx={{
              display: 'flex',
              gap: 1,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              size="small"
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(10, 10, 10, 0.5)',
                },
              }}
            />
            <IconButton
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              sx={{
                color: 'primary.main',
                '&:disabled': {
                  color: 'text.secondary',
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: 'rgba(0, 255, 136, 0.1)', mb: 2 }} />

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}
            >
              아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    p: 2,
                    background: 'rgba(10, 10, 10, 0.5)',
                    borderRadius: 1,
                    border: '1px solid rgba(0, 255, 136, 0.05)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {comment.users?.username || '알 수 없음'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {formatDate(comment.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {comment.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
