import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindAccountPage from './pages/FindAccountPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import FollowListPage from './pages/FollowListPage';
import SavedPostsPage from './pages/SavedPostsPage';
import UploadPage from './pages/UploadPage';
import PostDetailPage from './pages/PostDetailPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import ChatRoomPage from './pages/ChatRoomPage';
import SettingsPage from './pages/SettingsPage';

/**
 * PrivateRoute 컴포넌트
 *
 * 인증된 사용자만 접근 가능한 라우트
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

/**
 * PublicRoute 컴포넌트
 *
 * 비로그인 사용자만 접근 가능한 라우트
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
}

/**
 * AppRoutes 컴포넌트
 *
 * 애플리케이션 라우팅 설정
 */
function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/find-account"
        element={
          <PublicRoute>
            <FindAccountPage />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <PrivateRoute>
            <ProfileEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId/followers"
        element={
          <PrivateRoute>
            <FollowListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId/following"
        element={
          <PrivateRoute>
            <FollowListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <PrivateRoute>
            <SavedPostsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <UploadPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/post/:postId"
        element={
          <PrivateRoute>
            <PostDetailPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/search"
        element={
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <MessagesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/messages/:userId"
        element={
          <PrivateRoute>
            <ChatRoomPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:chatRoomId"
        element={
          <PrivateRoute>
            <ChatRoomPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

/**
 * App 컴포넌트
 *
 * 메인 앱 컴포넌트
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
