import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';

/**
 * RadioSection 컴포넌트
 * MUI RadioGroup과 FormControlLabel을 사용한 라디오 버튼 섹션
 *
 * Props:
 * @param {string} title - 섹션 제목 [Optional, 기본값: 'Radio']
 *
 * Example usage:
 * <RadioSection />
 */
function RadioSection({ title = 'Radio' }) {
  const [values, setValues] = useState({
    gender: '',
    plan: '',
    priority: ''
  });

  const handleChange = (field) => (event) => {
    setValues((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const radioGroups = [
    {
      key: 'gender',
      label: '성별',
      options: ['남성', '여성', '기타']
    },
    {
      key: 'plan',
      label: '요금제',
      options: ['Basic', 'Standard', 'Premium', 'Enterprise']
    },
    {
      key: 'priority',
      label: '우선순위',
      options: ['낮음', '보통', '높음', '긴급']
    }
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
        {radioGroups.map(({ key, label, options }) => (
          <Grid key={key} size={{ xs: 12, md: 4 }}>
            <FormControl>
              <FormLabel id={key + '-label'}>{label}</FormLabel>
              <RadioGroup
                aria-labelledby={key + '-label'}
                name={key}
                value={values[key]}
                onChange={handleChange(key)}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: 'text.secondary', minHeight: '1.5rem' }}
            >
              {values[key] && '선택값: ' + values[key]}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RadioSection;
