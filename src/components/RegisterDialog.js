import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography
} from '@mui/material';

export default function RegisterDialog({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    fetch('http://localhost:3005/posts/register', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert('게시물 등록 완료!');
        setTitle('');
        setContent('');
        setImage(null);
        onSuccess(); // 예: 글 목록 새로고침
        onClose();   // 모달 닫기
      })
      .catch(() => alert('등록 실패'));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'white' }}>게시물 등록</DialogTitle>
      <DialogContent sx={{ backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <Button variant="outlined" component="label">
            이미지 업로드
            <input
              type="file"
              hidden
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </Button>
          {image && <Typography variant="body2">{image.name}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'white' }}>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">등록</Button>
      </DialogActions>
    </Dialog>
  );
}
