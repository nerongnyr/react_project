import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatMessageBox from './ChatMessageBox';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 왼쪽: 채팅 목록 */}
      <ChatSidebar
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
      />

      {/* 오른쪽: 선택된 채팅방 메시지 */}
      <ChatMessageBox selectedRoom={selectedRoom} />
    </Box>
  );
}
