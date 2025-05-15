import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, List, ListItemButton, Avatar, Typography, Button
} from '@mui/material';

export default function NewChatDialog({ open, onClose, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) {
      const token = localStorage.getItem('token');
      fetch('http://localhost:3005/sns-user', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const { userid: myUserid } = JSON.parse(atob(token.split('.')[1]));
          const otherUsers = (data.list || []).filter(user => user.userid !== myUserid);
          setUsers(otherUsers);
        })
        .catch(err => console.error("유저 목록 불러오기 실패", err));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>새로운 메시지</DialogTitle>
      <DialogContent>
        <TextField fullWidth placeholder="검색…" sx={{ mb: 2 }} />
        <List>
          {users.map(user => (
            <ListItemButton
              key={user.id}
              selected={selected?.id === user.id}
              onClick={() => setSelected(user)}
            >
              <Avatar src={"http://localhost:3005" + user.profile_img || '/avatars/default.png'} sx={{ mr: 2 }} />
              <Typography>{user.userid}</Typography>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={!selected}
          onClick={async () => {
            const success = await onSelectUser(selected);
            if (success) onClose(); 
          }}
          fullWidth
        >
          채팅
        </Button>
      </DialogActions>
    </Dialog>
  );
}
