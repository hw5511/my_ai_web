import { createTheme } from '@mui/material/styles';

/**
 * SNS 앱 테마 설정
 *
 * 디자인 컨셉: 자연스러움, 편안함, 친근함
 * 메인 컬러: 올리브 그린
 * 스타일: 소프트 UI + 둥근 모서리
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B8E23',
      light: '#8FBC8F',
      dark: '#556B2F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8FBC8F',
      light: '#A8D5A8',
      dark: '#6B8E23',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
    error: {
      main: '#E57373',
    },
    success: {
      main: '#81C784',
    },
    warning: {
      main: '#FFD54F',
    },
    divider: '#EEEEEE',
    grey: {
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#999999',
      600: '#666666',
      700: '#333333',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Inter", "Roboto", sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 700,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      color: '#999999',
    },
  },
  spacing: 4,
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#556B2F',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#EEEEEE',
            },
            '&:hover fieldset': {
              borderColor: '#6B8E23',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6B8E23',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '1px solid #EEEEEE',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 56,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EEEEEE',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#999999',
          '&.Mui-selected': {
            color: '#6B8E23',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#333333',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#333333',
        },
      },
    },
  },
});

export default theme;
