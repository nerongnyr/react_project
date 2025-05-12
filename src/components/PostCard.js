import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Typography,
  Box
} from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function PostCard({ post, currentImageIndex, onPrev, onNext }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        avatar={<Avatar src={post.userProfile || `/avatars/default.png`} />}
        title={post.username || post.userid}
      />
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="400"
          image={"http://localhost:3005" + post.images[currentImageIndex]}
          alt="post"
        />
        {post.images.length > 1 && (
          <>
            <IconButton
              onClick={onPrev}
              sx={{ position: 'absolute', top: '50%', left: 0, color: 'white' }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={onNext}
              sx={{ position: 'absolute', top: '50%', right: 0, color: 'white' }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
      </Box>
      <CardActions disableSpacing>
        <IconButton><FavoriteBorderIcon /></IconButton>
        <IconButton><ChatBubbleOutlineIcon /></IconButton>
        <IconButton><SendIcon /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton><BookmarkBorderIcon /></IconButton>
      </CardActions>
      <CardContent>
        <Typography variant="body2" fontWeight="bold">
          {post.likes || 0}명이 좋아합니다
        </Typography>
        <Typography variant="body2">
            <b>{post.username || post.userid}</b> {post.content}
        </Typography>
        {post.comments.map(comment => (
          <Typography key={comment.id}><b>{comment.userid}</b> {comment.content}</Typography>
        ))}
      </CardContent>
    </Card>
  );
}
