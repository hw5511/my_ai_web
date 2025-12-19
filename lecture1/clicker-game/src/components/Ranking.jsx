import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Skeleton,
  Alert,
  Chip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

/**
 * Ranking 컴포넌트
 *
 * Props:
 * @param {Array} ranking - 랭킹 배열 [{ id, nickname, clicks }] [Required]
 * @param {boolean} isLoading - 로딩 중 여부 [Optional, 기본값: false]
 * @param {string} error - 에러 메시지 [Optional]
 * @param {string} currentPlayerId - 현재 플레이어 ID (하이라이트용) [Optional]
 *
 * Example usage:
 * <Ranking ranking={rankingData} isLoading={false} currentPlayerId="uuid" />
 */
function Ranking({ ranking, isLoading = false, error, currentPlayerId }) {
  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return 'primary.main';
    }
  };

  const getRankEmoji = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}`;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        height: '100%'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <EmojiEventsIcon color="primary" />
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          TOP 10 랭킹
        </Typography>
        <Chip
          label="3초 갱신"
          size="small"
          variant="outlined"
          sx={{ ml: 'auto' }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <List>
          {[...Array(5)].map((_, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton width="60%" />}
                secondary={<Skeleton width="40%" />}
              />
            </ListItem>
          ))}
        </List>
      ) : ranking.length === 0 ? (
        <Typography
          color="text.secondary"
          sx={{ textAlign: 'center', py: 4 }}
        >
          아직 플레이어가 없습니다
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {ranking.map((player, index) => (
            <ListItem
              key={player.id}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                bgcolor:
                  player.id === currentPlayerId
                    ? 'action.selected'
                    : 'transparent',
                border:
                  player.id === currentPlayerId
                    ? '2px solid'
                    : '2px solid transparent',
                borderColor:
                  player.id === currentPlayerId
                    ? 'primary.main'
                    : 'transparent'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getRankColor(index),
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  {getRankEmoji(index)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: player.id === currentPlayerId ? 'bold' : 'normal',
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}
                    >
                      {player.nickname}
                    </Typography>
                    {player.id === currentPlayerId && (
                      <Chip label="나" size="small" color="primary" />
                    )}
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                  >
                    {formatNumber(player.clicks)} 클릭
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default Ranking;
