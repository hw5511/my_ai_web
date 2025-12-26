import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MainLayout from '../components/common/MainLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProfilePage 컴포넌트
 *
 * 프로필 페이지
 * - 프로필 이미지, 게시물 수, 팔로워/팔로잉 수
 * - 바이오
 * - 게시물 그리드
 */
function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchProfile();
    }
  }, [targetUserId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('sns_users')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: postsData } = await supabase
        .from('sns_posts')
        .select(`
          id,
          images:sns_post_images(image_url, display_order)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      setPosts(postsData || []);

      const { count: postCount } = await supabase
        .from('sns_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      const { count: followerCount } = await supabase
        .from('sns_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      const { count: followingCount } = await supabase
        .from('sns_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId);

      setStats({
        posts: postCount || 0,
        followers: followerCount || 0,
        following: followingCount || 0,
      });

      if (user && !isOwnProfile) {
        const { data: followData } = await supabase
          .from('sns_follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
          .maybeSingle();

        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('sns_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        setStats({ ...stats, followers: stats.followers - 1 });
      } else {
        await supabase
          .from('sns_follows')
          .insert({ follower_id: user.id, following_id: targetUserId });

        setStats({ ...stats, followers: stats.followers + 1 });

        await supabase.from('sns_notifications').insert({
          user_id: targetUserId,
          actor_id: user.id,
          type: 'follow',
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${targetUserId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>사용자를 찾을 수 없습니다.</Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 600 }}>
              {profile.nickname}
            </Typography>
            {isOwnProfile && (
              <IconButton onClick={() => navigate('/settings')}>
                <SettingsOutlinedIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 3, md: 6 }, mb: 3 }}>
          <Avatar
            src={profile.profile_image}
            sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 } }}
          >
            {profile.nickname?.[0]}
          </Avatar>

          <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {stats.posts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                게시물
              </Typography>
            </Box>
            <Box
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${targetUserId}/followers`)}
            >
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {stats.followers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                팔로워
              </Typography>
            </Box>
            <Box
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${targetUserId}/following`)}
            >
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {stats.following}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                팔로잉
              </Typography>
            </Box>
          </Box>
        </Box>

        {profile.bio && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {profile.bio}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {isOwnProfile ? (
            <>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/profile/edit')}
              >
                프로필 편집
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/saved')}
              >
                저장됨
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                fullWidth
                onClick={handleFollow}
              >
                {isFollowing ? '팔로잉' : '팔로우'}
              </Button>
              <Button variant="outlined" fullWidth onClick={handleMessage}>
                메시지
              </Button>
            </>
          )}
        </Box>

        {posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              아직 게시물이 없습니다
            </Typography>
          </Box>
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
    </MainLayout>
  );
}

export default ProfilePage;
