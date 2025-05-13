import React, { useState, useEffect } from 'react';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { jwtDecode } from 'jwt-decode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from '@mui/material/Button';
import CommentDialog from './CommentDialog';

function getTimeAgo(datetime) {
  const diff = Date.now() - new Date(datetime).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}초 전`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function PostCard({ post, currentImageIndex, onPrev, onNext }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [sessionUser, setSessionUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

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

    const fetchLikeCount = async () => {
      try {
        const res = await fetch("http://localhost:3005/sns-post/" + post.id + "/likes-count");
        const data = await res.json();
        setLikeCount(data.count);
      } catch (error) {
        console.error("좋아요 수 불러오기 실패:", error);
      }
    };

    const fetchFollowing = async () => {
      if (!token || !post.userid) return;
      try {
        const res = await fetch("http://localhost:3005/sns-post/follow/check?target=" + post.userid, {
          headers: {
           "Authorization": "Bearer " + token,
          }
        });
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error("팔로우 여부 확인 실패:", error);
      }
    };

    const fetchLikedStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3005/sns-post/" + post.id + "/liked", {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        const data = await res.json();
        setLiked(data.liked);
      } catch (err) {
        console.error("좋아요 상태 확인 실패:", err);
      }
    };

    fetchLikeCount();
    fetchFollowing();
    fetchLikedStatus();
  }, [post.id, post.userid]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    let userId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userid || decoded.id || decoded.sub;
      } catch (e) {
        console.error("토큰 디코딩 오류:", e);
      }
    }

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3005/sns-post/" + post.id + "/like", {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      setLiked(data.status === 'liked');

      const countRes = await fetch("http://localhost:3005/sns-post/" + post.id + "/likes-count");
      const countData = await countRes.json();
      setLikeCount(countData.count);
    } catch (error) {
      console.error("좋아요 오류:", error);
    }
  };

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log("수정 클릭됨:", post.id);
    handleClose();
  };

  const handleDelete = () => {
    console.log("삭제 클릭됨:", post.id);
    handleClose();
  };

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3005/follow/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUserId: post.userid })
      });
      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("팔로우 처리 실패:", err);
    }
  };

  const time = getTimeAgo(post.cdatetime);

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        avatar={<Avatar src={post.userProfile || `/avatars/default.png`} />}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2">{post.username || post.userid}</Typography>
            {sessionUser && sessionUser.userid !== post.userid && (
              <Button size="small" onClick={handleFollow}>
                {isFollowing ? '팔로잉' : '팔로우'}
              </Button>
            )}
          </Box>
        }
        subheader={time}
        action={
          <>
            <IconButton onClick={handleMoreClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEdit}>수정</MenuItem>
              <MenuItem onClick={handleDelete}>삭제</MenuItem>
            </Menu>
          </>
        }
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
            <IconButton onClick={onPrev} sx={{ position: 'absolute', top: '50%', left: 0, color: 'white' }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton onClick={onNext} sx={{ position: 'absolute', top: '50%', right: 0, color: 'white' }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
      </Box>

      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          {liked ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton><ChatBubbleOutlineIcon /></IconButton>
        <IconButton><SendIcon /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton><BookmarkBorderIcon /></IconButton>
      </CardActions>

      <CardContent>
        <Typography variant="body2" fontWeight="bold">
          {likeCount || 0}명이 좋아합니다
        </Typography>
        <Typography variant="body2">
          <b>{post.username || post.userid}</b> {post.content}
        </Typography>
        {post.comments.map(comment => (
          <Typography key={comment.id}><b>{comment.userid}</b> {comment.content}</Typography>
        ))}
      {Array.isArray(post.comments) && post.comments.length > 0 ? (
        <Typography
          variant="body2"
          sx={{ color: 'gray', cursor: 'pointer', mt: 1 }}
          onClick={() => setCommentOpen(true)}
        >
          댓글 {post.comments.length}개 모두 보기
        </Typography>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: 'gray', mt: 1, cursor: 'pointer' }}
          onClick={() => setCommentOpen(true)} 
        >
          댓글이 없습니다.
        </Typography>
      )}
      </CardContent>
      <CommentDialog
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        post={post}
        imageUrl={"http://localhost:3005" + post.images[currentImageIndex]}
      />
    </Card>
  );
}
