import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

/**
 * ProjectsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ProjectsPage />
 */
function ProjectsPage() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        py: { xs: 4, md: 8 },
        background: 'linear-gradient(180deg, #FDF5F3 0%, #FCEAEA 100%)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 4,
            textAlign: 'center',
          }}
        >
          Projects
        </Typography>

        <Card
          sx={{
            backgroundColor: '#FFF8F6',
            border: '1px solid #FADCE3',
            p: { xs: 3, md: 5 },
            mb: 4,
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.1rem' },
                mb: 4,
              }}
            >
              Projects 페이지가 개발될 공간입니다. 포트폴리오 작품들이 들어갈 예정입니다.
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  backgroundColor: '#FFF8F6',
                  border: '1px solid #FADCE3',
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(196, 30, 58, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 120,
                      backgroundColor: '#F8C8D4',
                      borderRadius: 2,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                      }}
                    >
                      Project {item}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    프로젝트 {item}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.muted' }}
                  >
                    프로젝트 설명이 들어갈 공간
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ProjectsPage;
