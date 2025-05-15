import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, Box, Avatar, Typography, IconButton,
  Divider, Button, InputBase
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { jwtDecode } from 'jwt-decode';

function getTimeAgo(datetime) {
  if (!datetime) return '';
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

export default function CommentDialog({ open, onClose, post, onCommentChange }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userid || decoded.userId || decoded.id);
    }
  }, []);

  const fetchComments = useCallback(() => {
    if (!post) return ;
    fetch(`http://localhost:3005/sns-post/${post.id}/comments`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setComments(data);
        if (onCommentChange) onCommentChange(data.length);
      });
  }, [post, onCommentChange ]);

  useEffect(() => {
    if (post) fetchComments();
  }, [post, fetchComments]);

  useEffect(() => {
    if (replyingTo) {
      const target = comments.find(c => c.id === replyingTo);
      if (target) {
        const tag = `@${target.userId} `;
        if (!inputValue.startsWith(tag)) {
          setInputValue(tag);
        }
      }
    }
  }, [replyingTo, comments, inputValue]);

  if (!post) return null;

  const handleSubmit = () => {
    if (inputValue.trim() === '') return;

    if (editingId) {
      fetch(`http://localhost:3005/sns-post/comments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: inputValue })
      })
        .then(() => {
          setInputValue('');
          setEditingId(null);
          fetchComments();
        });
    } else {
      const parentId = replyingTo;
      fetch(`http://localhost:3005/sns-post/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: inputValue, parentId })
      })
        .then(() => {
          setInputValue('');
          setReplyingTo(null);
          fetchComments();
        });
    }
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setInputValue(content);
  };

  const handleLike = (id) => {
    fetch(`http://localhost:3005/sns-post/comments/${id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchComments());
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3005/sns-post/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => fetchComments());
  };

  const toggleReplies = (commentId) => {
    const newSet = new Set(expandedComments);
    newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
    setExpandedComments(newSet);
  };

  const countDescendants = (parentId) => {
    let count = 0;
    const stack = comments.filter(c => c.parentId === parentId);
    while (stack.length) {
      const current = stack.pop();
      count++;
      stack.push(...comments.filter(c => c.parentId === current.id));
    }
    return count;
  };

  const renderReplies = (parentId, level = 1) => {
    return comments
      .filter(c => c.parentId === parentId)
      .map(reply => {
        const indent = level === 1 ? 6 : 0;

        return (
          <Box key={reply.id} sx={{ mt: 1, pl: indent }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src="/avatars/default.png" sx={{ width: 24, height: 24 }} />
              <Typography variant="body2" sx={{ fontSize: 14, color: 'black' }}>
                <b>{reply.userId}</b> {editingId === reply.id ? '' : reply.content}
              </Typography>
            </Box>

            {editingId === reply.id && (
              <InputBase
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                sx={{ ml: 4, mt: 0.5, fontSize: 14, borderBottom: '1px solid #ccc' }}
              />
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                pl: 4,
                mt: 0.5,
                gap: '4px'
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {getTimeAgo(reply.cdatetime)}
              </Typography>
              <Button size="small" onClick={() => setReplyingTo(reply.id)} sx={{ p: '0 4px', minWidth: 'auto', fontSize: 11, color: 'gray' }}>답글 달기</Button>
              <IconButton
                onClick={() => handleLike(reply.id)}
                size="small"
                sx={{ p: '2px', color: reply.liked ? 'red' : 'gray' }}
              >
                {reply.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: 11, color: '#aaa', ml: '1px' }}>{reply.contentLike || 0}</Typography>
              {reply.userId === userId && (
                <>
                  <Button size="small" onClick={() => handleEdit(reply.id, reply.content)} sx={{ p: '0 4px', minWidth: 'auto', fontSize: 11, color: 'gray' }}>수정</Button>
                  <Button size="small" onClick={() => handleDelete(reply.id)} sx={{ p: '0 4px', minWidth: 'auto', fontSize: 11, color: 'gray' }}>삭제</Button>
                </>
              )}
            </Box>

            {renderReplies(reply.id, level + 1)}
          </Box>
        );
      });
  }

  if (!post) return null;
  const imageUrl = `http://localhost:3005${post.images[currentImageIndex]}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <Box sx={{ display: 'flex', width: '80vw', height: 'calc(80vw * 0.75)', maxWidth: '1000px', maxHeight: '750px', overflow: 'hidden', bgcolor: '#fff' }}>
        <Box sx={{ flex: 1.5, position: 'relative', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={imageUrl} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {post.images.length > 1 && (
            <>
              <IconButton onClick={() => setCurrentImageIndex(prev => Math.max(prev - 1, 0))} sx={{ position: 'absolute', left: 10, top: '50%', color: 'white' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton onClick={() => setCurrentImageIndex(prev => Math.min(prev + 1, post.images.length - 1))} sx={{ position: 'absolute', right: 10, top: '50%', color: 'white' }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>

        <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ddd', position: 'relative' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar src={post.userProfile} sx={{ mr: 1 }} />
            <Typography variant="subtitle2">{post.userid}</Typography>
          </Box>
          <Divider />

          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {comments.filter(c => c.parentId === null).map(comment => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src="/avatars/default.png" sx={{ width: 24, height: 24 }} />
                  <Typography variant="body2" sx={{ fontSize: 14, color: 'black' }}>
                    <b>{comment.userId}</b> {editingId === comment.id ? '' : comment.content}
                  </Typography>
                </Box>
                {editingId === comment.id && (
                  <InputBase
                    fullWidth
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    sx={{ ml: 4, mt: 0.5, fontSize: 14, borderBottom: '1px solid #ccc' }}
                  />
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', ml: '32px', mt: 0.5, gap: '4px' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                    {getTimeAgo(comment.cdatetime)}
                  </Typography>
                  <Button size="small" onClick={() => setReplyingTo(comment.id)} sx={{ p: '0 4px', fontSize: 11, color: 'gray', minWidth: 'auto' }}>
                    답글 달기
                  </Button>
                  <Button size="small" onClick={() => toggleReplies(comment.id)} sx={{ p: '0 4px', fontSize: 11, color: 'gray', minWidth: 'auto' }}>
                    {expandedComments.has(comment.id) ? '답글 숨기기' : `답글 보기 (${countDescendants(comment.id)})`}
                  </Button>
                  <IconButton onClick={() => handleLike(comment.id)} size="small" sx={{ p: '2px', color: comment.liked ? 'red' : 'gray' }}>
                    {comment.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                  <Typography variant="caption" sx={{ fontSize: 11, color: '#aaa', ml: '1px' }}>{comment.contentLike || 0}</Typography>
                  {comment.userId === userId && (
                    <>
                      <Button size="small" onClick={() => handleEdit(comment.id, comment.content)} sx={{ p: '0 4px', fontSize: 11, color: 'gray', minWidth: 'auto' }}>수정</Button>
                      <Button size="small" onClick={() => handleDelete(comment.id)} sx={{ p: '0 4px', fontSize: 11, color: 'gray', minWidth: 'auto' }}>삭제</Button>
                    </>
                  )}
                </Box>
                {expandedComments.has(comment.id) && renderReplies(comment.id)}
              </Box>
            ))}
          </Box>
          <Divider />
          {(replyingTo || editingId) && (
            <Typography variant="caption" sx={{ px: 2, pb: 1, color: 'gray' }}>
              <b>@{comments.find(c => c.id === (replyingTo || editingId))?.userId}</b> 님에게 {editingId ? '댓글 수정 중' : '답글 작성 중'}...
            </Typography>
          )}
          <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center' }}>
            <InputBase
              placeholder="댓글 달기..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              sx={{ flex: 1, fontSize: 14 }}
            />
            <Button onClick={handleSubmit} disabled={!inputValue.trim()} sx={{ color: inputValue.trim() ? '#0095f6' : 'gray', fontWeight: 'bold' }}>
              게시
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
