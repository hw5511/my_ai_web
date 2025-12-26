import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * SavedPostsPage 컴포넌트
 *
 * 저장된 게시물 페이지
 */
function SavedPostsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
    }
  }, [user]);

  const fetchSavedPosts = async () => {
    try {
      const { data } = await supabase
        .from('sns_saved_posts')
        .select(`
          post:sns_posts(
            id,
            images:sns_post_images(image_url, display_order)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const savedPosts = (data || [])
        .map((item) => item.post)
        .filter((post) => post !== null);

      setPosts(savedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
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
        <Typography variant="h2">저장됨</Typography>
      </Box>

      <Container sx={{ py: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            저장된 게시물이 없습니다
          </Typography>
        ) : (
          <Grid container spacing={0.5}>
            {posts.map((post) => (
              <Grid key={post.id} size={{ xs: 4 }}>
                <Box
                  sx={{
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <img
                    src={post.images?.[0]?.image_url || 'https://via.placeholder.com/300'}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default SavedPostsPage;
