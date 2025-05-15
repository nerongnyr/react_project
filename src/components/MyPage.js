import React, { useEffect, useState } from 'react';
import {
  Box, Avatar, Typography, Grid, Tabs, Tab, Divider, Button
} from '@mui/material';
import CommentDialog from '../components/CommentDialog';
import EditProfileDialog from '../components/EditProfileDialog';

export default function MyPage() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null); // 로그인한 사용자 정보
  const [posts, setPosts] = useState([]); // 썸네일 목록
  const [selectedPost, setSelectedPost] = useState(null); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  // 로그인 사용자 정보 + 게시물 목록 불러오기
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:3005/sns-user/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user || {});
        setPosts(data.posts || []);
      })
      .catch(err => console.error("유저 정보 불러오기 실패:", err));
  };

  const fetchBookmarks = () => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:3005/sns-user/bookmarks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBookmarkedPosts(data.posts || []))
      .catch(err => console.error("저장된 게시물 불러오기 실패:", err));
  };
  
  useEffect(() => {
    fetchUser();
    fetchBookmarks(); // 추가
  }, []);  

  const handleThumbnailClick = async (post) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3005/sns-post/${post.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setSelectedPost(data);
    setDialogOpen(true);
  };  

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: '"Pretendard", sans-serif' }}>
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          <Avatar
            src={"http://localhost:3005" + user?.profileImg || '/avatars/default.png'}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
                {user?.userid || 'userid'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditOpen(true)}
                sx={{
                  fontWeight: 'bold',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  textTransform: 'none',
                  py: 0.5,
                  px: 1.5
                }}
              >
                프로필 편집
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2"><b>{posts.length}</b> 게시물</Typography>
              <Typography variant="body2"><b>{user?.followerCount || 0}</b> 팔로워</Typography>
              <Typography variant="body2"><b>{user?.followingCount || 0}</b> 팔로잉</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">{user?.username || ''}</Typography>
          <Typography variant="body2">{user?.bio || ''}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
          <Tab label="게시물" />
          <Tab label="저장됨" />
        </Tabs>

        <Divider sx={{ mt: 2, mb: 1 }} />

        <Box sx={{ width: '100%', mt: 2 }}>
        <Grid
          container
          spacing={0.5}
          sx={{ margin: 0, width: '100%', '--spacing': '4px' }}
        >
          {(tab === 0 ? posts : bookmarkedPosts).map((post, i) => (
            <Grid
              item
              key={post.id || i}
              onClick={() => handleThumbnailClick(post)}
              sx={{
                width: `calc((100% - 2 * var(--spacing)) / 3)`,
                aspectRatio: '1 / 1',
                backgroundColor: '#eee',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <img
                src={`http://localhost:3005${post.thumbnail}`}
                alt={`post-${i}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Grid>
          ))}
        </Grid>
        </Box>

        <CommentDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          post={selectedPost}
        />
        <EditProfileDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          userData={user}
          onSave={() => {
            fetchUser();  
          }}
        />
      </Box>
    </Box>
  );
}
