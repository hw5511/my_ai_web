import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../lib/supabase';

/**
 * FindAccountPage 컴포넌트
 *
 * 아이디/비밀번호 찾기 페이지
 * - 아이디 찾기 탭
 * - 비밀번호 찾기 탭
 * - 로그인으로 돌아가기 버튼
 */
function FindAccountPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [findIdNickname, setFindIdNickname] = useState('');
  const [foundUsername, setFoundUsername] = useState('');

  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSuccess('');
    setFoundUsername('');
  };

  const handleFindId = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('sns_users')
        .select('username')
        .eq('nickname', findIdNickname)
        .single();

      if (dbError || !data) {
        setError('해당 닉네임으로 등록된 계정을 찾을 수 없습니다.');
      } else {
        setFoundUsername(data.username);
        setSuccess('아이디를 찾았습니다!');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const { data: user } = await supabase
        .from('sns_users')
        .select('id')
        .eq('username', resetUsername)
        .single();

      if (!user) {
        setError('해당 아이디로 등록된 계정을 찾을 수 없습니다.');
        return;
      }

      const { error: updateError } = await supabase
        .from('sns_users')
        .update({ password: newPassword })
        .eq('id', user.id);

      if (updateError) {
        setError('비밀번호 변경에 실패했습니다.');
      } else {
        setSuccess('비밀번호가 변경되었습니다. 로그인 페이지로 이동해주세요.');
        setResetUsername('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ mb: 2 }}>
          <IconButton component={Link} to="/login">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h2" sx={{ mb: 3, fontWeight: 600 }}>
          계정 찾기
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="아이디 찾기" />
          <Tab label="비밀번호 찾기" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {tab === 0 && (
          <Box component="form" onSubmit={handleFindId} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="닉네임"
              value={findIdNickname}
              onChange={(e) => setFindIdNickname(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ height: 48 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '아이디 찾기'}
            </Button>

            {foundUsername && (
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  찾은 아이디
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, color: 'primary.main' }}>
                  {foundUsername}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="아이디"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ height: 48 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '비밀번호 변경'}
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button component={Link} to="/login" variant="text">
            로그인으로 돌아가기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default FindAccountPage;
