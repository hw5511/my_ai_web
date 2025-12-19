import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { supabase } from '../lib/supabase';

/**
 * SignupPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <SignupPage />
 */
function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 중복 아이디 확인
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', formData.username)
        .single();

      if (existingUser) {
        setError('이미 존재하는 아이디입니다.');
        setIsLoading(false);
        return;
      }

      // 회원가입
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username: formData.username,
            password: formData.password,
          },
        ]);

      if (insertError) {
        setError('회원가입 중 오류가 발생했습니다.');
        setIsLoading(false);
        return;
      }

      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/login');
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
          top: '15%',
          right: '10%',
          width: '180px',
          height: '180px',
          border: '1px solid rgba(0, 255, 136, 0.1)',
          transform: 'rotate(30deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '120px',
          height: '120px',
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
          {/* 뒤로가기 버튼 */}
          <IconButton
            onClick={handleBackClick}
            disabled={isLoading}
            sx={{
              color: 'primary.main',
              mb: 2,
              '&:hover': {
                background: 'rgba(0, 255, 136, 0.1)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* 로고 영역 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SportsEsportsIcon
              sx={{
                fontSize: { xs: 40, md: 56 },
                color: 'primary.main',
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))',
              }}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                mt: 2,
                fontWeight: 700,
                color: 'primary.main',
                textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              회원가입
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 1 }}
            >
              Game Cube에 오신 것을 환영합니다
            </Typography>
          </Box>

          {/* 회원가입 폼 */}
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
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label="비밀번호 확인"
              type="password"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              sx={{ mb: 2 }}
              autoComplete="new-password"
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
                fontSize: '1rem',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : '회원가입'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignupPage;
