import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Avatar,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function CommentDialog({ open, onClose, post }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');

  if (!post) return null;

  const handlePrev = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      Math.min(prev + 1, post.images.length - 1)
    );
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') return;
    alert('댓글 등록: ' + newComment);
    setNewComment('');
  };

  const imageUrl = `http://localhost:3005${post.images[currentImageIndex]}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <Box sx={{
        display: 'flex',
        width: '80vw',
        height: 'calc(80vw * 0.75)', // 4:3 비율 유지
        maxWidth: '1000px',
        maxHeight: '750px',
        overflow: 'hidden',
        bgcolor: '#fff'
      }}>
        {/* 왼쪽 이미지 영역 */}
        <Box
          sx={{
            flex: 1.5,
            position: 'relative',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={imageUrl}
            alt="post"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {post.images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{ position: 'absolute', left: 10, top: '50%', color: 'white' }}
                disabled={currentImageIndex === 0}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{ position: 'absolute', right: 10, top: '50%', color: 'white' }}
                disabled={currentImageIndex === post.images.length - 1}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* 오른쪽 댓글 영역 */}
        <Box sx={{
          width: 360,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #ddd',
          position: 'relative'
        }}>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {/* 유저 정보 */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar src={post.userProfile} sx={{ mr: 1 }} />
            <Typography variant="subtitle2">{post.username || post.userid}</Typography>
          </Box>

          <Divider />

          {/* 댓글 목록 */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 1.5 }}>
                  <Typography variant="body2">
                    <b>{comment.userid}</b> {comment.content}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                아직 댓글이 없습니다.
              </Typography>
            )}
          </Box>

          <Divider />

          {/* 댓글 입력 */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="댓글을 입력하세요..."
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={handleCommentSubmit}>
              등록
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
