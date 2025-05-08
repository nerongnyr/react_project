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
  Link,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function JoinPage() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!userid || !password || !confirmPw || !email || !username || !phone || !addr) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPw) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    fetch('http://localhost:3005/sns-user/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, password, email, username, phone, addr }),
    })
      .then(res => {
        if (!res.ok) throw new Error('서버 응답 실패');
        return res.json();
      })
      .then(data => {
        if (data.result === 'success') {
          alert('회원가입 성공!');
          navigate('/login');
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
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'Cafe24SsurroundAir, sans-serif',
          fontWeight: 'bold',
          mb: 5,
        }}
      >
        Join
      </Typography>

      {/* 입력 항목들 */}
      <TextField
        fullWidth label="아이디" variant="outlined" size="small" margin="dense"
        value={userid} onChange={e => setUserid(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth label="이름" variant="outlined" size="small" margin="dense"
        value={username} onChange={e => setUsername(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth label="전화번호" variant="outlined" size="small" margin="dense"
        value={phone} onChange={e => setPhone(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth label="주소" variant="outlined" size="small" margin="dense"
        value={addr} onChange={e => setAddr(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth label="비밀번호" type="password" variant="outlined" size="small" margin="dense"
        value={password} onChange={e => setPassword(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth label="비밀번호 확인" type="password" variant="outlined" size="small" margin="dense"
        value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
        sx={{ maxWidth: 300 }}
      />
      <TextField
        fullWidth label="이메일" variant="outlined" size="small" margin="dense"
        value={email} onChange={e => setEmail(e.target.value)}
        sx={{ maxWidth: 300 }}
      />

      {/* 가입하기 버튼 */}
      <Button
        fullWidth variant="contained" onClick={handleJoin}
        sx={{
          maxWidth: 300, mt: 2,
          backgroundColor: '#000000',
          fontWeight: 'bold', py: 1,
          '&:hover': { backgroundColor: '#222222' },
        }}
      >
        가입하기
      </Button>

      <Divider sx={{ my: 3, width: '100%', maxWidth: 300, opacity: 0.5 }} />

      <Typography variant="body2">
        이미 계정이 있으신가요?{' '}
        <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold">
          로그인
        </Link>
      </Typography>

      {/* 실패 모달 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>회원가입 실패</DialogTitle>
        <DialogContent>다시 시도해주세요.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}