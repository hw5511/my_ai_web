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
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';

/**
 * RegisterPage 컴포넌트
 *
 * 회원가입 페이지
 * - 아이디 입력란
 * - 닉네임 입력란
 * - 비밀번호 입력란
 * - 비밀번호 확인 입력란
 * - 회원가입 버튼
 * - 뒤로가기 버튼
 */
function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.nickname, formData.password);
      navigate('/login');
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
        <Box sx={{ mb: 2 }}>
          <IconButton component={Link} to="/login">
            <ArrowBackIcon />
          </IconButton>
        </Box>

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
            variant="h2"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            회원가입
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="아이디"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="닉네임"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '회원가입'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default RegisterPage;
