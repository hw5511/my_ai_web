import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * SettingsPage 컴포넌트
 *
 * 설정 페이지
 * - 비밀번호 변경
 * - 계정 삭제
 * - 로그아웃
 */
function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');

    if (passwords.new !== passwords.confirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwords.new.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      const { data: userData } = await supabase
        .from('sns_users')
        .select('password')
        .eq('id', user.id)
        .single();

      if (userData?.password !== passwords.current) {
        setError('현재 비밀번호가 올바르지 않습니다.');
        return;
      }

      await supabase
        .from('sns_users')
        .update({ password: passwords.new })
        .eq('id', user.id);

      setSuccess('비밀번호가 변경되었습니다.');
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordDialog(false), 1500);
    } catch (error) {
      setError('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await supabase.from('sns_users').delete().eq('id', user.id);
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2">설정</Typography>
      </Box>

      <Container>
        <List>
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            계정
          </Typography>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setPasswordDialog(true)}>
              <ListItemIcon>
                <LockOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="비밀번호 변경" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setDeleteDialog(true)}>
              <ListItemIcon>
                <DeleteOutlineIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="계정 삭제" primaryTypographyProps={{ color: 'error' }} />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            알림
          </Typography>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <NotificationsNoneIcon />
              </ListItemIcon>
              <ListItemText primary="푸시 알림 설정" secondary="목업" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            개인정보
          </Typography>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SecurityOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="비공개 계정 설정" secondary="목업" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            정보
          </Typography>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InfoOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="앱 버전" secondary="1.0.0 (프로토타입)" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="로그아웃" primaryTypographyProps={{ color: 'error' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Container>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>비밀번호 변경</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField
            fullWidth
            label="현재 비밀번호"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="새 비밀번호"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="새 비밀번호 확인"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>취소</Button>
          <Button onClick={handlePasswordChange} variant="contained">변경</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>계정 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>취소</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SettingsPage;
