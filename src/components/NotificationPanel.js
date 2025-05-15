import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Slide,
  Toolbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function NotificationSlidePanel({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3005/sns-user/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setNotifications(data.notifications || []);
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3005/notifications/mark-all-read', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  };

  useEffect(() => {
    if (!open) return;

    fetchNotifications();
    markAllAsRead();

    const token = localStorage.getItem('token');
    const socket = new WebSocket(`ws://localhost:3006?token=${token}`);

    socket.onmessage = (event) => {
      try {
        const noti = JSON.parse(event.data);
        setNotifications(prev => [noti, ...prev]);
      } catch (err) {
        console.error('실시간 알림 파싱 오류:', err);
      }
    };

    return () => socket.close();
  }, [open]);

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          left: 0, // 왼쪽에 고정
          top: 0,
          bottom: 0,
          width: 320,
          maxWidth: '100%',
          bgcolor: '#fff',
          zIndex: 1300,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="h6" fontWeight="bold">알림</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Toolbar>
        <Divider />

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List>
            {notifications.length === 0 && (
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'gray' }}>
                아직 알림이 없습니다.
              </Typography>
            )}
            {notifications.map((n) => (
              <React.Fragment key={n.id || `${n.from_userid}-${n.target_id}-${n.type}`}>
                <ListItem alignItems="flex-start">
                  <Avatar
                    src={`http://localhost:3005${n.senderProfile || '/avatars/default.png'}`}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={`${n.senderUsername || '익명'}님이 ${n.type === 'like' ? '좋아요를 눌렀습니다' : '댓글을 달았습니다'}`}
                    secondary={new Date(n.cdatetime || n.createdAt).toLocaleString()}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </Slide>
  );
}
