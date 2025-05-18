import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';

export default function MessageInputBox({ roomId, onSend }) {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('content', text);
    formData.append('file_type', 'text');

    const res = await fetch(`http://localhost:3005/sns-chat/${roomId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      setText('');
      onSend?.();
    }
  };

  return (
    <Box sx={{
      p: 2,
      borderTop: '1px solid #ddd',
      bgcolor: '#fff',
      display: 'flex',
      alignItems: 'center',
    }}>
      <TextField
        variant="standard"
        fullWidth
        placeholder="메시지 입력..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <IconButton
              onClick={handleSend}
              sx={{ color: '#1976d2', ml: 1, p: 0 }}
            >
              <Typography fontSize="1rem" fontWeight="bold">전송</Typography>
            </IconButton>
          ),
          sx: {
            border: '1px solid #ccc',
            borderRadius: '30px',
            px: 2,
            py: 1,
            fontSize: '0.9rem',
            bgcolor: '#fff',
          }
        }}
      />
    </Box>
  );
}
