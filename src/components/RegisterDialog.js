import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Button, Box, Typography, TextField
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

export default function RegisterDialog({ open, onClose, onSuccess, post }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); // 새로 업로드된 이미지 (File 객체)
  const [existingImagesRaw, setExistingImagesRaw] = useState([]); // 서버용 경로 (/uploads/...)
  const [existingImagesDisplay, setExistingImagesDisplay] = useState([]); // UI 표시용 경로
  const [imageIndex, setImageIndex] = useState(0);
  const [sessionUser, setSessionUser] = useState(null);
  const navigate = useNavigate();

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

    if (post) {
      setContent(post.content || '');
      setImageIndex(0);
      setExistingImagesRaw(post.images || []);
      setExistingImagesDisplay((post.images || []).map(path => `http://localhost:3005${path}`));
      setImages([]);
    }
  }, [post]);

  const handleSubmit = () => {
    if (!content) {
      alert('내용을 입력해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('userId', sessionUser?.userid);
    formData.append('content', content);
    images.forEach(file => formData.append('images', file));
    formData.append('existingImages', JSON.stringify(existingImagesRaw));

    console.log('보내는 existingImagesRaw:', existingImagesRaw);
    for (let pair of formData.entries()) {
      console.log('FormData:', pair[0], pair[1]);
    }

    const method = post ? 'PUT' : 'POST';
    const url = post
      ? `http://localhost:3005/sns-post/${post.id}`
      : `http://localhost:3005/sns-post`;

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(post ? '게시물 수정 완료!' : '게시물 등록 완료!');
          setContent('');
          setImages([]);
          setExistingImagesRaw([]);
          setExistingImagesDisplay([]);
          onSuccess?.();
          onClose?.();
          navigate("/feed");
        } else {
          throw new Error(data.message || '실패');
        }
      })
      .catch(err => {
        console.error('전송 실패:', err);
        alert(post ? '수정 실패' : '등록 실패');
      });
  };

  const totalImages = [...existingImagesDisplay, ...images.map(file => URL.createObjectURL(file))];
  const displayedImage = totalImages[imageIndex];

  const handleDeleteImage = () => {
    if (imageIndex < existingImagesDisplay.length) {
      const newRaw = [...existingImagesRaw];
      const newDisplay = [...existingImagesDisplay];
      newRaw.splice(imageIndex, 1);
      newDisplay.splice(imageIndex, 1);
      setExistingImagesRaw(newRaw);
      setExistingImagesDisplay(newDisplay);
    } else {
      const imgIdx = imageIndex - existingImagesDisplay.length;
      const newFiles = [...images];
      newFiles.splice(imgIdx, 1);
      setImages(newFiles);
    }
    setImageIndex(0);
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
        {post ? '게시물 수정' : '게시물 등록'}
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
          {/* 왼쪽: 이미지 영역 */}
          <Box sx={{ flex: 1.2 }}>
            {totalImages.length > 0 && (
              <Box sx={{ position: 'relative', mb: 1 }}>
                <img
                  src={displayedImage}
                  alt={`preview-${imageIndex}`}
                  style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: 8 }}
                />
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                  <Button size="small" color="error" variant="contained" onClick={handleDeleteImage}>
                    삭제
                  </Button>
                </Box>
                {totalImages.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', left: 0, right: 0, px: 1, transform: 'translateY(-50%)' }}>
                    <Button
                      size="small"
                      onClick={() =>
                        setImageIndex((prev) => (prev - 1 + totalImages.length) % totalImages.length)
                      }
                    >
                      ◀
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        setImageIndex((prev) => (prev + 1) % totalImages.length)
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
                    setImages(prev => [...prev, ...files]);
                    setImageIndex(totalImages.length); // 새 이미지 위치로
                  }
                }}
              />
            </Button>
          </Box>

          {/* 오른쪽: 텍스트 입력 */}
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
        <Button onClick={handleSubmit} variant="contained">
          {post ? '수정' : '등록'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}