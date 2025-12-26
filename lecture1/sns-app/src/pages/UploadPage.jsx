import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * UploadPage 컴포넌트
 *
 * 게시물 업로드 페이지
 * - 1단계: 사진 선택
 * - 2단계: 캡션 입력
 */
function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleImages = Array.from({ length: 9 }, (_, i) =>
    `https://picsum.photos/300/300?random=${i + 1}`
  );

  const handleImageSelect = (imageUrl) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter((img) => img !== imageUrl));
    } else if (selectedImages.length < 10) {
      setSelectedImages([...selectedImages, imageUrl]);
    }
  };

  const handleNext = () => {
    if (selectedImages.length > 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleUpload = async () => {
    if (!user || selectedImages.length === 0) return;

    setLoading(true);
    try {
      const { data: post, error: postError } = await supabase
        .from('sns_posts')
        .insert({
          user_id: user.id,
          caption,
          location: location || null,
        })
        .select()
        .single();

      if (postError) throw postError;

      const imageInserts = selectedImages.map((url, index) => ({
        post_id: post.id,
        image_url: url,
        display_order: index + 1,
      }));

      await supabase.from('sns_post_images').insert(imageInserts);

      navigate('/');
    } catch (error) {
      console.error('Error uploading post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'background.default',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={handleBack}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h3">
          {step === 1 ? '새 게시물' : '새 게시물'}
        </Typography>
        {step === 1 ? (
          <Button
            onClick={handleNext}
            disabled={selectedImages.length === 0}
          >
            다음
          </Button>
        ) : (
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : '공유'}
          </Button>
        )}
      </Box>

      {step === 1 ? (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box
            sx={{
              aspectRatio: '1/1',
              maxHeight: '50vh',
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {selectedImages.length > 0 ? (
              <img
                src={selectedImages[selectedImages.length - 1]}
                alt="selected"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography color="text.secondary">
                이미지를 선택하세요
              </Typography>
            )}
          </Box>

          <Container sx={{ py: 2 }}>
            <Grid container spacing={0.5}>
              {sampleImages.map((imageUrl, index) => (
                <Grid key={index} size={{ xs: 4 }}>
                  <Box
                    sx={{
                      aspectRatio: '1/1',
                      cursor: 'pointer',
                      position: 'relative',
                      opacity: selectedImages.includes(imageUrl) ? 0.7 : 1,
                      border: selectedImages.includes(imageUrl)
                        ? '3px solid'
                        : 'none',
                      borderColor: 'primary.main',
                    }}
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {selectedImages.includes(imageUrl) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {selectedImages.indexOf(imageUrl) + 1}
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <img
                src={selectedImages[0]}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="문구 입력..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              variant="standard"
            />
          </Box>

          <TextField
            fullWidth
            placeholder="위치 추가"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default UploadPage;
