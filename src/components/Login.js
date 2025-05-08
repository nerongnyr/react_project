import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function LoginPage() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!userid || !password) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    fetch("http://localhost:3005/sns-user", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error('서버 응답 실패');
        return res.json();
      })
      .then(data => {
        const { result } = data;
        if (result.token) {
          localStorage.setItem('token', result.token);
          alert('로그인 성공!');
          navigate("/post");
        } else {
          setOpen(true);
        }
      })
      .catch(() => setOpen(true));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        fontFamily: '"Noto Sans KR", sans-serif',
      }}
    >
      {/* 귀여운 Login 폰트 */}
      <Typography
        variant="h3"
        sx={{
            fontFamily: 'Cafe24SsurroundAir, sans-serif', // 또는 'Cafe24Ssurround'
            fontWeight: 'bold',
            mb: 5,
        }}
        >
        Login
      </Typography>


      {/* 아이디 & 비밀번호 */}
      <TextField
        fullWidth
        label="아이디"
        variant="outlined"
        size="small"
        margin="dense"
        value={userid}
        onChange={(e) => setUserid(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth
        label="비밀번호"
        type="password"
        variant="outlined"
        size="small"
        margin="dense"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        sx={{ maxWidth: 300 }}
      />

      {/* 로그인 버튼 */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        sx={{
          maxWidth: 300,
          mt: 2,
          backgroundColor: '#000000',
          fontWeight: 'bold',
          py: 1,
          '&:hover': {
            backgroundColor: '#000000',
          },
        }}
      >
        로그인
      </Button>

      {/* 줄 */}
      <Divider sx={{ my: 3, width: '100%', maxWidth: 300, opacity: 1 }} />

      {/* 비밀번호 찾기 */}
      <Box sx={{ width: '100%', maxWidth: 300, textAlign: 'center' }}>
        <Link href="#" underline="hover" fontSize="0.85rem" color="primary">
          비밀번호를 잊으셨나요?
        </Link>
      </Box>

      {/* 가입하기 */}
      <Typography variant="body2" sx={{ mt: 4 }}>
        계정이 없으신가요?{' '}
        <Link component={RouterLink} to="/join" underline="hover" fontWeight="bold">
          가입하기
        </Link>
      </Typography>

      {/* 로그인 실패 모달 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>로그인 실패</DialogTitle>
        <DialogContent>아이디 또는 비밀번호가 올바르지 않습니다.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}