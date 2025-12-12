import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ButtonSection from './components/sections/ButtonSection';
import InputSection from './components/sections/InputSection';
import NavigationSection from './components/sections/NavigationSection';
import DropdownSection from './components/sections/DropdownSection';
import CheckboxSection from './components/sections/CheckboxSection';
import RadioSection from './components/sections/RadioSection';

function App() {
  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center',
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          UI Test Project
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ButtonSection />
          <InputSection />
          <NavigationSection />
          <DropdownSection />
          <CheckboxSection />
          <RadioSection />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
