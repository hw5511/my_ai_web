import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { supabase } from '../lib/supabase';

/**
 * MainPage 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인한 사용자 정보 [Required]
 * @param {function} onLogout - 로그아웃 시 실행할 함수 [Required]
 *
 * Example usage:
 * <MainPage user={currentUser} onLogout={handleLogout} />
 */
function MainPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          users (username),
          comments (id),
          likes (id)
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        return;
      }

      setPosts(postsData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteClick = () => {
    navigate('/write');
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
      }}
    >
      {/* 네비게이션 바 */}
      <AppBar position="sticky" sx={{ background: 'rgba(10, 10, 10, 0.95)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* 로고 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsEsportsIcon
              sx={{
                color: 'primary.main',
                fontSize: { xs: 28, md: 32 },
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.5))',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Game Cube
            </Typography>
          </Box>

          {/* 프로필 영역 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {user?.username}
            </Typography>
            <Chip
              label={user?.username}
              size="small"
              sx={{
                display: { xs: 'flex', sm: 'none' },
                background: 'rgba(0, 255, 136, 0.1)',
                color: 'primary.main',
                border: '1px solid rgba(0, 255, 136, 0.3)',
              }}
            />
            <Button
              variant="contained"
              startIcon={<CreateIcon />}
              onClick={handleWriteClick}
              size="small"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              글쓰기
            </Button>
            <IconButton
              onClick={handleWriteClick}
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: 'primary.main',
              }}
            >
              <CreateIcon />
            </IconButton>
            <IconButton
              onClick={onLogout}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메인 콘텐츠 */}
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {/* 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            게시판
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            총 {posts.length}개의 게시물
          </Typography>
        </Box>

        {/* 게시물 목록 */}
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress color="primary" />
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                아직 게시물이 없습니다.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CreateIcon />}
                onClick={handleWriteClick}
                sx={{ mt: 2 }}
              >
                첫 게시물 작성하기
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {posts.map((post, index) => (
                <ListItem
                  key={post.id}
                  disablePadding
                  sx={{
                    borderBottom:
                      index < posts.length - 1
                        ? '1px solid rgba(0, 255, 136, 0.1)'
                        : 'none',
                  }}
                >
                  <ListItemButton
                    onClick={() => handlePostClick(post.id)}
                    sx={{
                      py: { xs: 2, md: 2.5 },
                      px: { xs: 2, md: 3 },
                      '&:hover': {
                        background: 'rgba(0, 255, 136, 0.05)',
                      },
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      {/* 제목 */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.title}
                      </Typography>

                      {/* 메타 정보 */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.5, md: 2 },
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {post.users?.username || '알 수 없음'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <ChatBubbleOutlineIcon
                            sx={{ fontSize: 14, color: 'text.secondary' }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {post.comments?.length || 0}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <FavoriteIcon
                            sx={{ fontSize: 14, color: 'primary.main' }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: 'primary.main' }}
                          >
                            {post.likes?.length || 0}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 14, color: 'text.secondary' }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {formatDate(post.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default MainPage;
