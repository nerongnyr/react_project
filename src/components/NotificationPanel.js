import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Typography,
} from '@mui/material';

export default function NotificationPanel({ open }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!open) return;

    const token = localStorage.getItem('token');
    fetch('http://localhost:3005/sns-user/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []));

    fetch('http://localhost:3005/sns-user/notifications/mark-all-read', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

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
    <List>
      {notifications.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'gray' }}>
          아직 알림이 없습니다.
        </Typography>
      )}
      {notifications.map((n, index) => (
        <React.Fragment key={n.id || index}>
          <ListItem alignItems="flex-start">
            <Avatar
              src={`http://localhost:3005${n.senderProfile || '/avatars/default.png'}`}
              sx={{ mr: 2 }}
            />
            <ListItemText
              primary={`${n.senderUsername || '익명'}님이 ${n.type === 'like' ? '좋아요를 눌렀습니다' : '댓글을 달았습니다'}`}
              secondary={n.cdatetime ? new Date(n.cdatetime).toLocaleString() : '방금 전'}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}
