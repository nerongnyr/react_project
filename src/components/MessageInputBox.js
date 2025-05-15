import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

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
    <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #ddd' }}>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        placeholder="메시지 입력..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <Button onClick={handleSend} sx={{ ml: 1 }} variant="contained">전송</Button>
    </Box>
  );
}
