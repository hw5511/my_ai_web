import { useState } from 'react';
import { Box } from '@mui/material';

/**
 * ImageSlider 컴포넌트
 *
 * 이미지 슬라이드 (좌우 스와이프)
 *
 * Props:
 * @param {Array} images - 이미지 URL 배열 [Required]
 * @param {string} aspectRatio - 이미지 비율 [Optional, 기본값: '1/1']
 */
function ImageSlider({ images, aspectRatio = '1/1' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    setTouchStart(null);
  };

  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.3s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
            height: '100%',
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '100%',
                height: '100%',
              }}
            >
              <img
                src={typeof image === 'string' ? image : image.image_url}
                alt={`slide ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0.5,
            py: 1,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'primary.main' : 'grey.300',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ImageSlider;
