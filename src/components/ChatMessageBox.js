import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Avatar, IconButton, Paper } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import MessageInputBox from './MessageInputBox';

export default function ChatMessageBox({ selectedRoom }) {
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const { id } = JSON.parse(atob(token.split('.')[1]));
    setMyId(id);
  }, [token]);

  useEffect(() => {
    if (!selectedRoom) return;

    fetch(`http://localhost:3005/sns-chat/${selectedRoom.room_id}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("메시지 불러오기 실패:", err));

    // 읽음 처리 요청
    fetch(`http://localhost:3005/sns-chat/${selectedRoom.room_id}/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  }, [selectedRoom, token]);

  useEffect(() => {
    if (!selectedRoom) return;

    socketRef.current = new WebSocket(`ws://localhost:3006?token=${token}`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.room_id === selectedRoom.room_id) {
        setMessages(prev => [...prev, data]);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, [selectedRoom, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text, file) => {
    if ((!text || !text.trim()) && !file) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        room_id: selectedRoom.room_id,
        content: text || '',
        file_type: file ? file.type.startsWith('image') ? 'image' : 'file' : 'text',
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          message.file_data = reader.result;
          message.file_name = file.name;
          socketRef.current.send(JSON.stringify(message));
        };
        reader.readAsDataURL(file);
      } else {
        socketRef.current.send(JSON.stringify(message));
      }
    }
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = date.getHours();
    const min = String(date.getMinutes()).padStart(2, '0');
    const ampm = h < 12 ? '오전' : '오후';
    const hour12 = h % 12 || 12;
    return `${y}. ${m}. ${d}. ${ampm} ${hour12}:${min}`;
  };

  if (!selectedRoom) {
    return (
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="text.secondary">채팅방을 선택하세요</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
        <Avatar src={"http://localhost:3005" + selectedRoom?.avatar || '/avatars/default.png'} sx={{ width: 40, height: 40, mr: 2 }} />
        <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
          {selectedRoom?.partner_user_id || '상대방'}
        </Typography>
        <IconButton><CallIcon /></IconButton>
        <IconButton><VideocamIcon /></IconButton>
        <IconButton><InfoIcon /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', backgroundColor: '#FFF' }}>
        {messages.map((msg, idx) => {
          const isMine = msg.sender_id === myId;
          return (
            <Box
              key={idx}
              sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', mb: 2 }}
            >
              <Box>
              <Paper
                sx={{
                  px: 2,
                  py: 1.2,
                  backgroundColor: isMine ? '#3390ec' : '#f0f2f5',
                  color: isMine ? '#fff' : '#000',
                  borderRadius: 20,
                  maxWidth: 360,
                  boxShadow: 'none'
                }}
              >
                  {msg.file_type === 'image' ? (
                    <img src={msg.file_url || msg.file_data} alt="img" style={{ maxWidth: 300, borderRadius: 8 }} />
                  ) : msg.file_type === 'file' ? (
                    <a href={msg.file_url || '#'} download style={{ color: 'inherit' }}>{msg.file_name || '파일 다운로드'}</a>
                  ) : (
                    <Typography>{msg.content}</Typography>
                  )}
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
                  {formatTime(msg.cdatetime)} {msg.is_read && isMine ? '읽음' : ''}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={scrollRef} />
      </Box>

      <MessageInputBox
        roomId={selectedRoom.room_id}
        userInfo={selectedRoom}
        onSend={handleSendMessage}
      />
    </Box>
  );
}
