import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemText, Toolbar, ListItemIcon,
  Box, Typography, useMediaQuery, Slide
} from '@mui/material';
import { Home, Search, AccountCircle, Instagram } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from 'react-router-dom';
import RegisterDialog from './RegisterDialog';
import SearchPanel from './SearchPanel';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 70;

function Menu() {
  const [openRegister, setOpenRegister] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창 열림 상태
  const isMobile = useMediaQuery('(max-width:768px)');

  const toggleMenu = (collapse = true) => {
    setCollapsed(collapse);
  };

  const handleSearchClick = () => {
    toggleMenu(true);        // 메뉴 축소
    setIsSearchOpen(true);   // 검색창 열기
  };

  const handleHomeClick = () => {
    toggleMenu(false);       // 메뉴 확장
    setIsSearchOpen(false);  // 검색창 닫기
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed || isMobile ? drawerWidthCollapsed : drawerWidthExpanded,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed || isMobile ? drawerWidthCollapsed : drawerWidthExpanded,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          {(collapsed || isMobile)
            ? <Instagram sx={{ fontSize: 24 }} />
            : <Typography variant="h5">Instagram</Typography>}
        </Box>
        <List>
          <ListItem button component={Link} to="/feed" onClick={handleHomeClick}>
            <ListItemIcon><Home /></ListItemIcon>
            {!collapsed && <ListItemText primary="홈" />}
          </ListItem>

          <ListItem button onClick={handleSearchClick}>
            <ListItemIcon><Search /></ListItemIcon>
            {!collapsed && <ListItemText primary="검색" />}
          </ListItem>

          <ListItem button component={Link} to="/dm">
            <ListItemIcon><MailOutlineIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="메시지" />}
          </ListItem>

          <ListItem button onClick={() => setOpenRegister(true)}>
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="만들기" />}
          </ListItem>

          <ListItem button component={Link} to="/mypage">
            <ListItemIcon><AccountCircle /></ListItemIcon>
            {!collapsed && <ListItemText primary="프로필" />}
          </ListItem>
        </List>
      </Drawer>

      {/* 슬라이딩 검색창 - 홈 옆에 고정 */}
      <Slide direction="right" in={isSearchOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            left: drawerWidthCollapsed,
            top: 0,
            bottom: 0,
            width: 300,
            backgroundColor: '#fff',
            boxShadow: 3,
            zIndex: 1201,
            overflowY: 'auto',
          }}
        >
          <Toolbar />
          <SearchPanel />
        </Box>
      </Slide>

      {/* 만들기 다이얼로그 */}
      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onSuccess={() => setOpenRegister(false)}
      />
    </>
  );
}

export default Menu;
