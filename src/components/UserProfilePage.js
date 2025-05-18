import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Avatar, Typography, Grid, Button, Divider
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import CommentDialog from '../components/CommentDialog';
import FollowListDialog from './FollowListDialog';

export default function UserProfilePage() {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [followOpen, setFollowOpen] = useState(false);
  const [followType, setFollowType] = useState('followers');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    if (decoded.userid === userid) {
      navigate('/mypage');
      return;
    }

    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3005/sns-user/${userid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
      setIsFollowing(data.isFollowing);
    };

    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:3005/sns-user/user/${userid}`);
      const data = await res.json();
      setPosts(data.posts);
    };

    fetchUser();
    fetchPosts();
  }, [userid, navigate]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3005/sns-user/follow/toggle", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetUserId: userid }),
    });
    const data = await res.json();
    setIsFollowing(data.isFollowing);

    setUser(prev => ({
    ...prev,
    followerCount: prev.followerCount + (data.isFollowing ? 1 : -1)
  }));
  };

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

  if (!user) return <Typography>로딩 중...</Typography>;

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: '"Pretendard", sans-serif' }}>
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          <Avatar
            src={"http://localhost:3005" + user.profile_img || '/avatars/default.png'}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
                {user.userid}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleFollow}
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
                {isFollowing ? "팔로잉" : "팔로우"}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2"><b>{posts.length}</b> 게시물</Typography>
              <Typography variant="body2" onClick={() => { setFollowType('followers'); setFollowOpen(true); }} sx={{ cursor: 'pointer' }}>
                <b>{user.followerCount}</b> 팔로워
              </Typography>
              <Typography variant="body2" onClick={() => { setFollowType('followings'); setFollowOpen(true); }} sx={{ cursor: 'pointer' }}>
                <b>{user.followingCount}</b> 팔로잉
              </Typography>

              <FollowListDialog
                open={followOpen}
                onClose={() => setFollowOpen(false)}
                userId={user?.userid}
                type={followType}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">{user.username || ''}</Typography>
          <Typography variant="body2">{user.bio || ''}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid
          container
          spacing={0.5}
          sx={{ margin: 0, width: '100%', '--spacing': '4px' }}
        >
          {posts.map((post, i) => (
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
                src={`http://localhost:3005${post.img}`}
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

        <CommentDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          post={selectedPost}
        />
      </Box>
    </Box>
  );
}
