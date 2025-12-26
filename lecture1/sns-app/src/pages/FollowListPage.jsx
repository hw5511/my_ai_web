import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * FollowListPage 컴포넌트
 *
 * 팔로워/팔로잉 목록 페이지
 */
function FollowListPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});

  const isFollowers = location.pathname.includes('followers');
  const isOwnProfile = userId === user?.id;

  useEffect(() => {
    fetchUsers();
  }, [userId, isFollowers]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(users.filter((u) =>
        u.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      let query;
      if (isFollowers) {
        query = supabase
          .from('sns_follows')
          .select(`
            id,
            user:sns_users!follower_id(id, nickname, profile_image, bio)
          `)
          .eq('following_id', userId);
      } else {
        query = supabase
          .from('sns_follows')
          .select(`
            id,
            user:sns_users!following_id(id, nickname, profile_image, bio)
          `)
          .eq('follower_id', userId);
      }

      const { data } = await query;

      const userList = (data || []).map((item) => ({
        ...item.user,
        followId: item.id,
      }));

      setUsers(userList);
      setFilteredUsers(userList);

      if (user) {
        const statusMap = {};
        for (const u of userList) {
          const { data: followData } = await supabase
            .from('sns_follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', u.id)
            .maybeSingle();

          statusMap[u.id] = !!followData;
        }
        setFollowingStatus(statusMap);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!user) return;

    try {
      if (followingStatus[targetUserId]) {
        await supabase
          .from('sns_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);
      } else {
        await supabase
          .from('sns_follows')
          .insert({ follower_id: user.id, following_id: targetUserId });
      }

      setFollowingStatus({
        ...followingStatus,
        [targetUserId]: !followingStatus[targetUserId],
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleRemoveFollower = async (targetUserId) => {
    try {
      await supabase
        .from('sns_follows')
        .delete()
        .eq('follower_id', targetUserId)
        .eq('following_id', user.id);

      setUsers(users.filter((u) => u.id !== targetUserId));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== targetUserId));
    } catch (error) {
      console.error('Error removing follower:', error);
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
        <Typography variant="h2">
          {isFollowers ? '팔로워' : '팔로잉'}
        </Typography>
      </Box>

      <Container sx={{ py: 2 }}>
        <TextField
          fullWidth
          placeholder="검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {isFollowers ? '아직 팔로워가 없습니다' : '아직 팔로잉하는 사람이 없습니다'}
          </Typography>
        ) : (
          <List disablePadding>
            {filteredUsers.map((listUser) => (
              <ListItem key={listUser.id} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    src={listUser.profile_image}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${listUser.id}`)}
                  >
                    {listUser.nickname?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={listUser.nickname}
                  secondary={listUser.bio}
                  secondaryTypographyProps={{ noWrap: true }}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${listUser.id}`)}
                />
                {user && listUser.id !== user.id && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={followingStatus[listUser.id] ? 'outlined' : 'contained'}
                      size="small"
                      onClick={() => handleFollow(listUser.id)}
                    >
                      {followingStatus[listUser.id] ? '팔로잉' : '팔로우'}
                    </Button>
                    {isFollowers && isOwnProfile && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFollower(listUser.id)}
                      >
                        삭제
                      </Button>
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}

export default FollowListPage;
