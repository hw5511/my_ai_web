import { useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import LoginForm from './components/LoginForm';
import ClickButton from './components/ClickButton';
import Ranking from './components/Ranking';
import useClicker from './hooks/useClicker';
import useRanking from './hooks/useRanking';

function App() {
  const [player, setPlayer] = useState(null);

  const { clicks, handleClick, isSaving } = useClicker(
    player?.id,
    player?.clicks || 0
  );
  const { ranking, isLoading: rankingLoading, error: rankingError } = useRanking();

  const handleLogin = (loggedInPlayer) => {
    setPlayer(loggedInPlayer);
  };

  // 로그인 전: 로그인 폼 표시
  if (!player) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 로그인 후: 게임 화면 표시
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* 클릭 버튼 영역 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <ClickButton
              clicks={clicks}
              onClick={handleClick}
              isSaving={isSaving}
              nickname={player.nickname}
            />
          </Grid>

          {/* 랭킹 영역 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Ranking
              ranking={ranking}
              isLoading={rankingLoading}
              error={rankingError}
              currentPlayerId={player.id}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
