import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

/**
 * ButtonSection 컴포넌트
 * MUI Button의 다양한 variant와 color 조합을 보여주는 섹션
 *
 * Props:
 * @param {string} title - 섹션 제목 [Optional, 기본값: 'Button']
 *
 * Example usage:
 * <ButtonSection />
 * <ButtonSection title="버튼 컴포넌트" />
 */
function ButtonSection({ title = 'Button' }) {
  const handleClick = (variant, color) => {
    alert(`${variant} + ${color} 버튼이 클릭되었습니다!`);
  };

  const variants = ['contained', 'outlined', 'text'];
  const colors = ['primary', 'secondary', 'error'];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 600,
          fontSize: { xs: '1.25rem', md: '1.5rem' }
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={3}>
        {variants.map((variant) => (
          <Grid key={variant} size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, color: 'text.secondary', textTransform: 'capitalize' }}
            >
              {variant}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {colors.map((color) => (
                <Button
                  key={`${variant}-${color}`}
                  variant={variant}
                  color={color}
                  onClick={() => handleClick(variant, color)}
                >
                  {color}
                </Button>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ButtonSection;
