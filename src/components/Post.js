import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const stories = ['user1', 'user2', 'user3', 'user4', 'user5'];
const posts = [
  {
    user: 'johndoe',
    avatar: '/avatars/john.png',
    image: '/posts/post1.jpg',
    likes: 125,
    caption: '오늘 날씨 너무 좋다 ☀️',
  },
  {
    user: 'janedoe',
    avatar: '/avatars/jane.png',
    image: '/posts/post2.jpg',
    likes: 200,
    caption: '맛있는 점심~',
  },
];

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* 중앙 정렬 + 가로폭 제한 */}
      <Box sx={{ maxWidth: 530, mx: 'auto' }}>
        {/* 상단바 */}
        <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'black' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Pretendard, sans-serif' }}>
              Instagram
            </Typography>
            <IconButton>
              <SendIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 스토리 */}
        <Box sx={{ display: 'flex', overflowX: 'auto', px: 2, py: 1 }}>
          {stories.map((name, index) => (
            <Box key={index} sx={{ textAlign: 'center', mr: 2 }}>
              <Avatar
                src={`/avatars/${name}.png`}
                sx={{ width: 56, height: 56, border: '2px solid #f06292' }}
              />
              <Typography variant="caption">{name}</Typography>
            </Box>
          ))}
        </Box>

        {/* 피드 */}
        <Box sx={{ px: 2 }}>
          {posts.map((post, index) => (
            <Card key={index} sx={{ mb: 4 }}>
              <CardHeader
                avatar={<Avatar src={post.avatar} />}
                title={post.user}
                sx={{ fontWeight: 'bold' }}
              />
              <CardMedia
                component="img"
                height="400"
                image={post.image}
                alt="post"
              />
              <CardActions disableSpacing>
                <IconButton><FavoriteBorderIcon /></IconButton>
                <IconButton><ChatBubbleOutlineIcon /></IconButton>
                <IconButton><SendIcon /></IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton><BookmarkBorderIcon /></IconButton>
              </CardActions>
              <CardContent>
                <Typography variant="body2" fontWeight="bold">{post.likes}명이 좋아합니다</Typography>
                <Typography variant="body2"><b>{post.user}</b> {post.caption}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
