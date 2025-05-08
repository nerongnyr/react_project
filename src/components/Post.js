import React, { useEffect, useState } from 'react';
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

export default function HomePage() {
    const [feedList, setFeedList] = useState()

    const fnFeedList = () => {
        fetch("http://localhost:3005/sns-post")
        .then(res => res.json())
        .then(data => setFeedList(data.list))
      }
    
      useEffect(()=>{
        fnFeedList()
      }, [])

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
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
                {feedList && feedList.length > 0 ? (
                    feedList.map((post, index) => (
                    <Card key={index} sx={{ mb: 4 }}>
                        <CardHeader
                        avatar={<Avatar src={post.avatar || `/avatars/default.png`} />}
                        title={post.user}
                        />
                        <CardMedia
                        component="img"
                        height="400"
                        image={post.image || '/posts/default.jpg'}
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
                        <Typography variant="body2" fontWeight="bold">
                            {post.likes || 0}명이 좋아합니다
                        </Typography>
                        <Typography variant="body2">
                            <b>{post.user}</b> {post.caption}
                        </Typography>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <Typography align="center" sx={{ mt: 4, color: '#888' }}>
                    게시물이 없습니다.
                    </Typography>
                )}
                </Box>
            </Box>
        </Box>
    );
}
