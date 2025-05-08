import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Button, Box, Typography, TextField
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function RegisterDialog({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState(null);

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (images) formData.append('images', images);

    fetch('http://localhost:3005/sns-post', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert('게시물 등록 완료!');
        setTitle('');
        setContent('');
        setImages(null);
        onSuccess(); // 예: 글 목록 새로고침
        onClose();   // 모달 닫기
      })
      .catch(() => alert('등록 실패'));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>
        게시물 등록
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, mt: 2 }}>
          {/* 왼쪽: 사진 업로드 */}
          <Box sx={{ flex: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              fullWidth
              sx={{ mb: 1 }}
            >
              사진 업로드
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setImages(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {images && <Typography variant="body2">{images.name}</Typography>}
          </Box>

          {/* 오른쪽: 프로필 + 내용 */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
            {/* 프로필 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 2 }}>
              <Avatar src="/avatars/default.png" sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography variant="body2" fontSize="0.8rem">userid</Typography>
            </Box>

            {/* 내용 */}
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={6}
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '1.15rem', lineHeight: '1.7', px: 1 },
              }}
            />
            <Box sx={{ textAlign: 'right', fontSize: '0.75rem', color: 'gray', mt: 0.5 }}>
              {content.length}/1000
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, backgroundColor: 'white' }}>
        <Button onClick={onClose} color="error">취소</Button>
        <Button onClick={handleSubmit} variant="contained">등록</Button>
      </DialogActions>
    </Dialog>

  );
}
