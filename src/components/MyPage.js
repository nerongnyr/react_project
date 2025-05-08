import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Grid,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';

const posts = Array.from({ length: 12 }, (_, i) => `/posts/post${(i % 3) + 1}.jpg`);

export default function MyPage() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: '"Pretendard", sans-serif' }}>
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 4 }}>

        {/* 프로필 상단 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src="/avatars/user1.png"
            sx={{ width: 80, height: 80, mr: 4 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">username</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2"><b>20</b> 게시물</Typography>
              <Typography variant="body2"><b>150</b> 팔로워</Typography>
              <Typography variant="body2"><b>180</b> 팔로잉</Typography>
            </Box>
          </Box>
        </Box>

        {/* 자기소개 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">홍길동</Typography>
          <Typography variant="body2">React 개발자, 맛집 탐방, 여행 기록 ✈️</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 탭 (게시물 / 저장됨) */}
        <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
          <Tab label="게시물" />
          <Tab label="저장됨" />
        </Tabs>

        <Divider sx={{ mt: 2, mb: 1 }} />

        {/* 게시물 그리드 */}
        {tab === 0 && (
          <Grid container spacing={1}>
            {posts.map((src, i) => (
              <Grid item xs={4} key={i}>
                <Box
                  component="img"
                  src={src}
                  alt={`post-${i}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* 저장됨 탭 */}
        {tab === 1 && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography color="text.secondary">저장된 게시물이 없습니다.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
