import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

/**
 * LoginPage 컴포넌트
 *
 * 로그인 페이지
 * - 로고
 * - 아이디 입력란
 * - 비밀번호 입력란
 * - 로그인 버튼
 * - 아이디/비밀번호 찾기 링크
 * - 회원가입 버튼
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
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
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2,
            }}
          >
            Olive
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
          </Button>

          <Link to="/find-account" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="text.secondary">
              아이디/비밀번호 찾기
            </Typography>
          </Link>

          <Box sx={{ width: '100%', borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
            <Button
              component={Link}
              to="/register"
              fullWidth
              variant="outlined"
              size="large"
              sx={{ height: 48 }}
            >
              회원가입
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
