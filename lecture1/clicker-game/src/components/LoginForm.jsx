import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { supabase } from '../lib/supabase';

/**
 * LoginForm 컴포넌트
 *
 * Props:
 * @param {function} onLogin - 로그인 성공 시 호출되는 함수 (player 객체 전달) [Required]
 *
 * Example usage:
 * <LoginForm onLogin={(player) => setPlayer(player)} />
 */
function LoginForm({ onLogin }) {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (trimmedNickname.length < 2 || trimmedNickname.length > 20) {
      setError('닉네임은 2~20자 사이로 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 기존 플레이어 조회
      const { data: existingPlayer, error: selectError } = await supabase
        .from('players')
        .select('*')
        .eq('nickname', trimmedNickname)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingPlayer) {
        // 기존 플레이어로 로그인
        onLogin(existingPlayer);
      } else {
        // 새 플레이어 생성
        const { data: newPlayer, error: insertError } = await supabase
          .from('players')
          .insert([{ nickname: trimmedNickname }])
          .select()
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            setError('이미 사용 중인 닉네임입니다.');
            return;
          }
          throw insertError;
        }

        onLogin(newPlayer);
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          maxWidth: 400,
          width: '100%',
          mx: 2
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Clicker Game
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="닉네임"
            variant="outlined"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={isLoading}
            placeholder="닉네임을 입력하세요"
            sx={{ mb: 3 }}
            autoFocus
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '시작하기'
            )}
          </Button>
        </form>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 3 }}
        >
          닉네임이 없으면 새로 생성됩니다
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginForm;
