import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, IconButton, List, ListItem, Avatar,
  ListItemText, Button, TextField, InputAdornment, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

export default function FollowListDialog({ open, onClose, userId, type }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!open || !userId || !type) return;
    const fetchList = async () => {
      const res = await fetch(`http://localhost:3005/sns-user/${userId}/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setList(data.list || []);
    };
    fetchList();
  }, [open, userId, type, token]);

  // 검색어로 목록 필터링
  useEffect(() => {
    if (!search.trim()) {
      setFilteredList(list);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredList(
        list.filter(user =>
          user.userid.toLowerCase().includes(lowerSearch) ||
          (user.username && user.username.toLowerCase().includes(lowerSearch))
        )
      );
    }
  }, [search, list]);

  const toggleFollow = async (targetId) => {
    const res = await fetch('http://localhost:3005/sns-user/follow/toggle', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetUserId: targetId })
    });
    const data = await res.json();
    setList(prev => prev.map(user =>
      user.userid === targetId ? { ...user, isFollowing: data.isFollowing } : user
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {type === 'followers' ? '팔로워' : '팔로잉'}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      {/* 검색 입력창 */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', backgroundColor: '#f5f5f5' }
          }}
        />
      </Box>

      {/* 사용자 목록 */}
      <List>
        {filteredList.map(user => (
          <ListItem key={user.userid} secondaryAction={
            <Button
              variant="outlined"
              size="small"
              onClick={() => toggleFollow(user.userid)}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              {user.isFollowing ? '팔로잉' : '팔로우'}
            </Button>
          }>
            <Avatar src={`http://localhost:3005${user.profileImg}`} sx={{ mr: 2 }} />
            <ListItemText primary={user.userid} secondary={user.username} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
