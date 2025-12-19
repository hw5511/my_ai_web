import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { supabase } from '../lib/supabase';

/**
 * LoginPage 컴포넌트
 *
 * Props:
 * @param {function} onLogin - 로그인 성공 시 실행할 함수 [Required]
 *
 * Example usage:
 * <LoginPage onLogin={handleLogin} />
 */
function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', formData.username)
        .eq('password', formData.password)
        .single();

      if (dbError || !data) {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        setIsLoading(false);
        return;
      }

      onLogin(data);
      navigate('/');
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 2, md: 4 },
      }}
    >
      {/* 기하학적 배경 요소 */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          border: '1px solid rgba(0, 255, 136, 0.1)',
          transform: 'rotate(45deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          border: '1px solid rgba(0, 255, 136, 0.15)',
          borderRadius: '50%',
        }}
      />

      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            background: 'rgba(20, 20, 20, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.1)',
          }}
        >
          {/* 로고 영역 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SportsEsportsIcon
              sx={{
                fontSize: { xs: 48, md: 64 },
                color: 'primary.main',
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))',
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mt: 2,
                fontWeight: 700,
                color: 'primary.main',
                textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Game Cube
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 1 }}
            >
              게이머들의 커뮤니티
            </Typography>
          </Box>

          {/* 로그인 폼 */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="username"
              label="아이디"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              sx={{ mb: 2 }}
              autoComplete="username"
            />
            <TextField
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              sx={{ mb: 2 }}
              autoComplete="current-password"
            />

            {error && (
              <Typography
                variant="body2"
                sx={{ color: 'error.main', mb: 2, textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 2,
                fontSize: '1rem',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleSignupClick}
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderColor: 'rgba(0, 255, 136, 0.5)',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(0, 255, 136, 0.1)',
                },
              }}
            >
              회원가입
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
