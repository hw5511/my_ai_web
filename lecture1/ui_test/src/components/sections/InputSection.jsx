import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

/**
 * InputSection 컴포넌트
 * MUI TextField의 다양한 variant를 보여주는 섹션
 *
 * Props:
 * @param {string} title - 섹션 제목 [Optional, 기본값: 'Input']
 *
 * Example usage:
 * <InputSection />
 * <InputSection title="입력 필드" />
 */
function InputSection({ title = 'Input' }) {
  const [values, setValues] = useState({
    standard: '',
    outlined: '',
    filled: ''
  });

  const handleChange = (variant) => (event) => {
    setValues((prev) => ({
      ...prev,
      [variant]: event.target.value
    }));
  };

  const variants = [
    { key: 'standard', label: 'Standard', placeholder: 'Standard 입력' },
    { key: 'outlined', label: 'Outlined', placeholder: 'Outlined 입력' },
    { key: 'filled', label: 'Filled', placeholder: 'Filled 입력' }
  ];

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
        {variants.map(({ key, label, placeholder }) => (
          <Grid key={key} size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              variant={key}
              label={label}
              placeholder={placeholder}
              value={values[key]}
              onChange={handleChange(key)}
            />
            <Typography
              variant="body2"
              sx={{ mt: 1, color: 'text.secondary', minHeight: '1.5rem' }}
            >
              {values[key] && `입력값: ${values[key]}`}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default InputSection;
