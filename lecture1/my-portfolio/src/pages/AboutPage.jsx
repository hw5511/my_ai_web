import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * AboutPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <AboutPage />
 */
function AboutPage() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
        background: 'linear-gradient(180deg, #FDF5F3 0%, #FCEAEA 100%)',
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            backgroundColor: '#FFF8F6',
            border: '1px solid #FADCE3',
            p: { xs: 3, md: 6 },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 4,
              }}
            >
              About Me
            </Typography>
            <Box
              sx={{
                width: 120,
                height: 120,
                backgroundColor: '#F8C8D4',
                borderRadius: '50%',
                mx: 'auto',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #C41E3A',
              }}
            >
              <Typography
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '2rem',
                }}
              >
                ME
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              About Me 페이지가 개발될 공간입니다. 상세한 자기소개가 들어갈 예정입니다.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AboutPage;
