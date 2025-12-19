import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SyncIcon from '@mui/icons-material/Sync';

/**
 * ClickButton 컴포넌트
 *
 * Props:
 * @param {number} clicks - 현재 클릭 횟수 [Required]
 * @param {function} onClick - 클릭 시 호출되는 함수 [Required]
 * @param {boolean} isSaving - 저장 중 여부 [Optional, 기본값: false]
 * @param {string} nickname - 플레이어 닉네임 [Required]
 *
 * Example usage:
 * <ClickButton clicks={100} onClick={handleClick} isSaving={false} nickname="Player1" />
 */
function ClickButton({ clicks, onClick, isSaving = false, nickname }) {
  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 3, md: 4 },
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          {nickname}
        </Typography>
        {isSaving && (
          <Chip
            icon={<SyncIcon sx={{ animation: 'spin 1s linear infinite' }} />}
            label="저장 중"
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' }
              }
            }}
          />
        )}
      </Box>

      <Typography
        variant="h2"
        component="div"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          fontSize: { xs: '2.5rem', md: '4rem' },
          color: 'primary.main'
        }}
      >
        {formatNumber(clicks)}
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={onClick}
        sx={{
          width: { xs: 150, md: 200 },
          height: { xs: 150, md: 200 },
          borderRadius: '50%',
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          fontWeight: 'bold',
          boxShadow: 4,
          transition: 'transform 0.1s, box-shadow 0.1s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6
          },
          '&:active': {
            transform: 'scale(0.95)',
            boxShadow: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TouchAppIcon sx={{ fontSize: { xs: 40, md: 60 }, mb: 1 }} />
          CLICK!
        </Box>
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 3, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
      >
        클릭하여 점수를 올리세요!
      </Typography>
    </Paper>
  );
}

export default ClickButton;
