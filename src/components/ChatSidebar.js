import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, List, ListItemButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create'; 
import IconButton from '@mui/material/IconButton';
import NewChatDialog from './NewChatDialog';

export default function ChatSidebar({ selectedRoom, setSelectedRoom }) {
  const [chats, setChats] = useState([]);
  const [newChatOpen, setNewChatOpen] = useState(false); 
  const [me, setMe] = useState(null); 

  const fetchChats = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3005/sns-chat', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(err => console.error("채팅 목록 불러오기 실패:", err));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    // 사용자 정보
    fetch('http://localhost:3005/sns-user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMe(data.list?.[0]))
      .catch(err => console.error("사용자 정보 가져오기 실패", err));
  
    // 채팅 목록
    fetchChats();
  }, []);

  const handleStartChat = async (targetUser) => {
    const token = localStorage.getItem('token');
  
    const res = await fetch('http://localhost:3005/sns-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        is_group: false,
        targetUserId: targetUser.id
      })
    });
  
    const data = await res.json();

    if (data.success) {
        fetchChats(); 
        setSelectedRoom({ 
          room_id: data.roomId,   
          is_group: false,
          partner_user_id: targetUser.userid,
          avatar: targetUser.profile_img
        });
      }

      return true;
  };  

  return (
    <Box sx={{ width: 320, borderRight: '1px solid #ddd', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight="bold">
        {me?.userid || '...'}
      </Typography>
        <IconButton onClick={() => setNewChatOpen(true)}>
            <CreateIcon />
        </IconButton>
      </Box>

      <NewChatDialog
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onSelectUser={handleStartChat}
      />

      <List>
        {chats.map(chat => (
          <ListItemButton
            key={chat.room_id}
            selected={selectedRoom?.room_id === chat.room_id}
            onClick={() => setSelectedRoom(chat)}
            sx={{ py: 1.5 }}
          >
            <Avatar src={"http://localhost:3005" + chat.avatar || '/avatars/default.png'} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle2">
                {chat.is_group ? chat.room_name : chat.partner_user_id}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap maxWidth="180px">
                {chat.message}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
