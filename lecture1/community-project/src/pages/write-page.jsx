import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublishIcon from '@mui/icons-material/Publish';
import { supabase } from '../lib/supabase';

/**
 * WritePage 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인한 사용자 정보 [Required]
 *
 * Example usage:
 * <WritePage user={currentUser} />
 */
function WritePage({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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

    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title.trim(),
            content: formData.content.trim(),
            author_id: user.id,
          },
        ]);

      if (insertError) {
        setError('게시물 등록 중 오류가 발생했습니다.');
        setIsLoading(false);
        return;
      }

      navigate('/');
    } catch (err) {
      setError('게시물 등록 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="md">
        {/* 뒤로가기 버튼 */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          disabled={isLoading}
          sx={{
            mb: 2,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              background: 'rgba(0, 255, 136, 0.1)',
            },
          }}
        >
          목록으로
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            background: 'rgba(20, 20, 20, 0.9)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 3,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            새 게시물 작성
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* 제목 입력란 */}
            <TextField
              fullWidth
              name="title"
              label="제목"
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              disabled={isLoading}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(10, 10, 10, 0.5)',
                },
              }}
            />

            {/* 내용 입력란 */}
            <TextField
              fullWidth
              name="content"
              label="내용"
              variant="outlined"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              multiline
              rows={12}
              disabled={isLoading}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(10, 10, 10, 0.5)',
                },
              }}
            />

            {error && (
              <Typography
                variant="body2"
                sx={{ color: 'error.main', mb: 2, textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}

            {/* 버튼 영역 */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBackClick}
                disabled={isLoading}
                sx={{
                  px: 3,
                  borderColor: 'rgba(0, 255, 136, 0.5)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    background: 'rgba(0, 255, 136, 0.1)',
                  },
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? null : <PublishIcon />}
                disabled={isLoading}
                sx={{ px: 3 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : '게시물 등록'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default WritePage;
