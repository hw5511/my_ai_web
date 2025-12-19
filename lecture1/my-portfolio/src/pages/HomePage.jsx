import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import GuestbookSection from '../components/landing/GuestbookSection';

/**
 * HomePage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #FDF5F3 0%, #FCEAEA 100%)',
          py: { xs: 8, md: 12 },
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 3,
              }}
            >
              Hero Section
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.8,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* About Me Section */}
      <Box
        sx={{
          backgroundColor: '#FFF8F6',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #FADCE3',
              p: { xs: 3, md: 5 },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 3,
                }}
              >
                About Me
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.8,
                }}
              >
                여기는 About Me 섹션입니다. 간단한 자기소개와 &apos;더 알아보기&apos; 버튼이 들어갈 예정입니다.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/about"
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                더 알아보기
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Skill Tree Section */}
      <Box
        sx={{
          backgroundColor: '#FCEAEA',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 4,
              textAlign: 'center',
            }}
          >
            Skill Tree
          </Typography>
          <Card
            sx={{
              backgroundColor: '#FFF8F6',
              border: '1px solid #F4ACB7',
              p: { xs: 3, md: 5 },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                }}
              >
                여기는 Skill Tree 섹션입니다. 기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Projects Section */}
      <Box
        sx={{
          backgroundColor: '#FDF5F3',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 4,
              textAlign: 'center',
            }}
          >
            Projects
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid key={item} size={{ xs: 12, md: 4 }}>
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
                        width: 80,
                        height: 80,
                        backgroundColor: '#F8C8D4',
                        borderRadius: 2,
                        mx: 'auto',
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
                        {item}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.muted' }}
                    >
                      Project {item}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.8,
              }}
            >
              여기는 Projects 섹션입니다. 대표작 썸네일 3-4개와 &apos;더 보기&apos; 버튼이 들어갈 예정입니다.
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/projects"
              sx={{
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'secondary.light',
                  borderColor: 'secondary.main',
                  color: '#FFFFFF',
                },
                px: 4,
                py: 1.5,
              }}
            >
              더 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F8C8D4 0%, #FADCE3 100%)',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 4,
              textAlign: 'center',
            }}
          >
            Contact
          </Typography>
          <GuestbookSection />
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
