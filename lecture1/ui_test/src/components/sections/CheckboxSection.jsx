import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Divider from '@mui/material/Divider';

/**
 * CheckboxSection 컴포넌트
 * MUI Checkbox와 FormControlLabel을 사용한 체크박스 섹션
 *
 * Props:
 * @param {string} title - 섹션 제목 [Optional, 기본값: 'Checkbox']
 *
 * Example usage:
 * <CheckboxSection />
 */
function CheckboxSection({ title = 'Checkbox' }) {
  const options = ['React', 'Vue', 'Angular', 'Svelte'];
  
  const [checked, setChecked] = useState(
    options.reduce((acc, option) => ({ ...acc, [option]: false }), {})
  );

  const handleChange = (option) => (event) => {
    setChecked((prev) => ({
      ...prev,
      [option]: event.target.checked
    }));
  };

  const checkedItems = options.filter((option) => checked[option]);
  const isAllChecked = checkedItems.length === options.length;
  const isIndeterminate = checkedItems.length > 0 && checkedItems.length < options.length;

  const handleSelectAll = (event) => {
    const newChecked = options.reduce(
      (acc, option) => ({ ...acc, [option]: event.target.checked }),
      {}
    );
    setChecked(newChecked);
  };

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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAllChecked}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
              />
            }
            label="전체 선택"
          />
          <Divider sx={{ my: 1 }} />
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={checked[option]}
                    onChange={handleChange(option)}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        </Box>

        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.100', 
          borderRadius: 1,
          minWidth: { xs: '100%', md: 200 }
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            선택된 항목:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {checkedItems.length > 0 
              ? checkedItems.join(', ')
              : '선택된 항목이 없습니다'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CheckboxSection;
