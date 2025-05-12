import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PostCard from './PostCard';

const stories = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7'];

export default function HomePage() {
    const [feedList, setFeedList] = useState([])
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    const fnFeedList = () => {
        fetch("http://localhost:3005/sns-post")
        .then(res => res.json())
        .then(data => {
            console.log("받은 데이터:", data)
            setFeedList(data.list)
        })
      }
    
      useEffect(()=>{
        fnFeedList()
      }, [])

      const handlePrev = (postIdx) => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [postIdx]: Math.max((prev[postIdx] || 0) - 1, 0)
        }));
      };
      
      const handleNext = (postIdx, maxLength) => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [postIdx]: Math.min((prev[postIdx] || 0) + 1, maxLength - 1)
        }));
      };

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
            <Box sx={{ display: 'flex', overflowX: 'hidden', px: 2, py: 1 }}>
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
                        <PostCard
                          key={index}
                          post={post}
                          index={index}
                          currentImageIndex={currentImageIndex[index] || 0}
                          onPrev={() => handlePrev(index)}
                          onNext={() => handleNext(index, post.images.length)}
                        />
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
