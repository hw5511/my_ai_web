import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { supabase } from '../../lib/supabase';

/**
 * GuestbookSection 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <GuestbookSection />
 */
function GuestbookSection() {
  const [guestbooks, setGuestbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    author: '',
    job: '',
    content: '',
    rating: 5,
    contact: '',
    isContactPublic: false,
  });

  useEffect(() => {
    fetchGuestbooks();
  }, []);

  const fetchGuestbooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuestbooks(data || []);
    } catch (err) {
      setError('방명록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, rating: newValue || 1 }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isContactPublic: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.content.trim()) {
      setError('작성자 이름과 내용은 필수입니다.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const { error } = await supabase.from('guestbook').insert([
        {
          author: formData.author.trim(),
          job: formData.job.trim() || null,
          content: formData.content.trim(),
          rating: formData.rating,
          contact: formData.contact.trim() || null,
          is_contact_public: formData.isContactPublic,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        author: '',
        job: '',
        content: '',
        rating: 5,
        contact: '',
        isContactPublic: false,
      });

      fetchGuestbooks();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('방명록 등록에 실패했습니다.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 방명록 입력 폼 */}
      <Card
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #FADCE3',
          mb: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              mb: 3,
              textAlign: 'center',
            }}
          >
            방명록 남기기
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              방명록이 등록되었습니다!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="작성자 이름"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="직업 (선택)"
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="내용"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    별점:
                  </Typography>
                  <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    precision={1}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />
                    }
                    sx={{
                      '& .MuiRating-iconFilled': { color: 'primary.main' },
                      '& .MuiRating-iconHover': { color: 'primary.light' },
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="연락처 (선택)"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  size="small"
                  placeholder="이메일 또는 전화번호"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isContactPublic}
                        onChange={handleSwitchChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'primary.main',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                            {
                              backgroundColor: 'primary.main',
                            },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        연락처 공개
                      </Typography>
                    }
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      backgroundColor: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.dark' },
                      px: 4,
                      py: 1,
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      '등록하기'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* 방명록 목록 */}
      <Typography
        variant="h5"
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          mb: 3,
          textAlign: 'center',
        }}
      >
        방명록 목록
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : guestbooks.length === 0 ? (
        <Card
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #FADCE3',
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              아직 방명록이 없습니다. 첫 번째 방명록을 남겨주세요!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {guestbooks.map((item) => (
            <Card
              key={item.id}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #FADCE3',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(196, 30, 58, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon
                        sx={{ color: 'primary.main', fontSize: '1.2rem' }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: 'text.primary' }}
                      >
                        {item.author}
                      </Typography>
                    </Box>
                    {item.job && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <WorkIcon
                          sx={{ color: 'secondary.main', fontSize: '1rem' }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {item.job}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Rating
                    value={item.rating}
                    readOnly
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': { color: 'primary.main' },
                    }}
                  />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.8,
                    mb: 2,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {item.content}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon
                      sx={{ color: 'text.secondary', fontSize: '1rem' }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {formatDate(item.created_at)}
                    </Typography>
                  </Box>
                  {item.is_contact_public && item.contact && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon
                        sx={{ color: 'secondary.main', fontSize: '1rem' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: 'secondary.main' }}
                      >
                        {item.contact}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default GuestbookSection;
