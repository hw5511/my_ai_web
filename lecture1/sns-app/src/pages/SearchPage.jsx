import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MainLayout from '../components/common/MainLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * SearchPage 컴포넌트
 *
 * 검색 페이지
 * - 유저 검색
 * - 최근 검색 기록
 */
function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecentSearches();
    }
  }, [user]);

  useEffect(() => {
    if (query.trim()) {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchRecentSearches = async () => {
    try {
      const { data } = await supabase
        .from('sns_search_history')
        .select(`
          id,
          searched_user:sns_users!searched_user_id(id, nickname, profile_image, bio)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentSearches(data || []);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    }
  };

  const searchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('sns_users')
        .select('id, nickname, profile_image, bio')
        .ilike('nickname', `%${query}%`)
        .limit(20);

      setResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (searchedUser) => {
    if (user) {
      await supabase.from('sns_search_history').insert({
        user_id: user.id,
        searched_user_id: searchedUser.id,
      });
    }
    navigate(`/profile/${searchedUser.id}`);
  };

  const handleDeleteSearch = async (searchId) => {
    try {
      await supabase.from('sns_search_history').delete().eq('id', searchId);
      setRecentSearches(recentSearches.filter((s) => s.id !== searchId));
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    try {
      await supabase.from('sns_search_history').delete().eq('user_id', user.id);
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing searches:', error);
    }
  };

  return (
    <MainLayout>
      <Container sx={{ py: 2 }}>
        <TextField
          fullWidth
          placeholder="검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setQuery('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {!query && recentSearches.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                최근 검색
              </Typography>
              <Button size="small" onClick={handleClearAll}>
                전체 삭제
              </Button>
            </Box>
            <List disablePadding>
              {recentSearches.map((search) => (
                <ListItem
                  key={search.id}
                  sx={{ px: 0, cursor: 'pointer' }}
                  onClick={() => handleUserClick(search.searched_user)}
                >
                  <ListItemAvatar>
                    <Avatar src={search.searched_user?.profile_image}>
                      {search.searched_user?.nickname?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={search.searched_user?.nickname}
                    secondary={search.searched_user?.bio}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSearch(search.id);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {query && (
          <Box>
            {results.length === 0 && !loading ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                검색 결과가 없습니다
              </Typography>
            ) : (
              <List disablePadding>
                {results.map((searchedUser) => (
                  <ListItem
                    key={searchedUser.id}
                    sx={{ px: 0, cursor: 'pointer' }}
                    onClick={() => handleUserClick(searchedUser)}
                  >
                    <ListItemAvatar>
                      <Avatar src={searchedUser.profile_image}>
                        {searchedUser.nickname?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={searchedUser.nickname}
                      secondary={searchedUser.bio}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {!query && recentSearches.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            사용자를 검색해보세요
          </Typography>
        )}
      </Container>
    </MainLayout>
  );
}

export default SearchPage;
