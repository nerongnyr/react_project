import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Join from './components/Join'; 
import Post from './components/Post';
import Register from './components/RegisterDialog';
import MyPage from './components/MyPage';
import Menu from './components/Menu'; 
import SearchPanel from './components/SearchPanel'; 
import Dm from './components/Dm'; 
import EditPostPage from './components/EditPostPage';
import NotificationPage from './components/NotificationPanel'
import UserProfilePage from './components/UserProfilePage'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/join' || location.pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isAuthPage && <Menu />} {/* 로그인과 회원가입 페이지가 아닐 때만 Menu 렌더링 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={<Post />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPanel />} />
          <Route path="/dm" element={<Dm />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/edit/:id" element={<EditPostPage />} />
          <Route path="/profile/:userid" element={<UserProfilePage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
