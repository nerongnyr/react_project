import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Button, Box, Typography, TextField
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { jwtDecode } from 'jwt-decode';

export default function RegisterDialog({ open, onClose, onSuccess }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setSessionUser(decoded);

      } catch (err) {
        console.error("토큰 디코딩 실패", err);
      }
    }
  }, []);

  console.log("sessionUser:", sessionUser);

  const handleSubmit = () => {
    if (!content) {
      alert('내용을 입력해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('userId', sessionUser?.userid);

    formData.append('content', content);
    images.forEach((file) => {
      formData.append('images', file);
    });

    fetch('http://localhost:3005/sns-post', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert('게시물 등록 완료!');
        setContent('');
        setImages([]);
        onSuccess();
        onClose();
      })
      .catch(() => alert('등록 실패'));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={false}
      sx={{
        '& .MuiDialog-paper': {
          width: '700px',
          maxWidth: '90vw'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>
        게시물 등록
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: 'white' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            mt: 2,
            maxWidth: '1000px',
            mx: 'auto'
          }}
        >
          {/* 왼쪽: 사진 업로드 */}
          <Box sx={{ flex: 1.2 }}>
            {images?.length > 0 && (
              <Box sx={{ position: 'relative', mb: 1 }}>
                <img
                  src={URL.createObjectURL(images[imageIndex])}
                  alt={`preview-${imageIndex}`}
                  style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: 8 }}
                />
                {images.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', left: 0, right: 0, px: 1, transform: 'translateY(-50%)' }}>
                    <Button
                      size="small"
                      onClick={() =>
                        setImageIndex((prev) => (prev - 1 + images.length) % images.length)
                      }
                    >
                      ◀
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        setImageIndex((prev) => (prev + 1) % images.length)
                      }
                    >
                      ▶
                    </Button>
                  </Box>
                )}
              </Box>
            )}

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
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length > 0) {
                    setImages(files);
                    setImageIndex(0);
                  }
                }}
              />
            </Button>
          </Box>

          {/* 오른쪽: 프로필 + 내용 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={sessionUser?.profileImg || '/avatars/default.png'} sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography variant="body2" fontSize="0.8rem">
                {sessionUser?.userid || '익명'}
              </Typography>
            </Box>

            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={15}
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '0.85rem',
                  lineHeight: '1.7',
                  px: 1,
                  minHeight: '200px',
                },
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
        <Button
          onClick={() => {
            handleSubmit();
          }}
          variant="contained"
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
