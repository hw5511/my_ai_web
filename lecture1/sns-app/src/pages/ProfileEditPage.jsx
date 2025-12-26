import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Avatar,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProfileEditPage 컴포넌트
 *
 * 프로필 편집 페이지
 */
function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
    profile_image: user?.profile_image || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('sns_users')
        .update({
          nickname: formData.nickname,
          bio: formData.bio,
          gender: formData.gender || null,
          profile_image: formData.profile_image || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      updateUser(formData);
      navigate('/profile');
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const sampleAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2">프로필 편집</Typography>
        <Button onClick={handleSave} disabled={loading}>
          완료
        </Button>
      </Box>

      <Container sx={{ py: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={formData.profile_image}
            sx={{ width: 100, height: 100, mb: 2 }}
          >
            {formData.nickname?.[0]}
          </Avatar>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              const randomAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
              setFormData({ ...formData, profile_image: randomAvatar });
            }}
          >
            사진 변경
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            label="소개"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            rows={3}
            inputProps={{ maxLength: 150 }}
            helperText={`${formData.bio.length}/150`}
          />

          <FormControl fullWidth>
            <InputLabel>성별</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="성별"
            >
              <MenuItem value="">선택 안함</MenuItem>
              <MenuItem value="male">남성</MenuItem>
              <MenuItem value="female">여성</MenuItem>
              <MenuItem value="other">기타</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfileEditPage;
