import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

/**
 * DropdownSection 컴포넌트
 * MUI Select와 MenuItem을 사용한 드롭다운 섹션
 *
 * Props:
 * @param {string} title - 섹션 제목 [Optional, 기본값: 'Dropdown']
 *
 * Example usage:
 * <DropdownSection />
 */
function DropdownSection({ title = 'Dropdown' }) {
  const [values, setValues] = useState({
    fruit: '',
    color: '',
    size: ''
  });

  const handleChange = (field) => (event) => {
    setValues((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const dropdowns = [
    {
      key: 'fruit',
      label: '과일 선택',
      options: ['사과', '바나나', '오렌지', '포도', '딸기']
    },
    {
      key: 'color',
      label: '색상 선택',
      options: ['빨강', '파랑', '초록', '노랑']
    },
    {
      key: 'size',
      label: '사이즈 선택',
      options: ['Small', 'Medium', 'Large', 'XLarge']
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
        {dropdowns.map(({ key, label, options }) => (
          <Grid key={key} size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id={key + '-label'}>{label}</InputLabel>
              <Select
                labelId={key + '-label'}
                id={key}
                value={values[key]}
                label={label}
                onChange={handleChange(key)}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
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

export default DropdownSection;
