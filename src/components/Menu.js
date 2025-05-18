import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  ListItemIcon,
  Box,
  Typography,
  useMediaQuery,
  Slide,
  Badge,
  IconButton,
  Divider
} from '@mui/material';
import {
  Home,
  Search,
  AccountCircle,
  Instagram
} from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

import RegisterDialog from './RegisterDialog';
import SearchPanel from './SearchPanel';
import NotificationPanel from './NotificationPanel'; 
import MoreMenu from './MoreMenu';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 70;

function Menu() {
  const [openRegister, setOpenRegister] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const isMobile = useMediaQuery('(max-width:963px)');
  const [unreadCount, setUnreadCount] = useState(0);

  const hideText = collapsed || isMobile;

  const closeAllPanels = () => {
    setIsSearchOpen(false);
    setOpenNoti(false);
  };

  const handleSearchClick = () => {
    closeAllPanels();
    setCollapsed(true);
    setIsSearchOpen(true);
  };

  const handleNotiClick = () => {
    closeAllPanels();
    setCollapsed(true);
    setOpenNoti(true);
  };

  const handleHomeClick = () => {
    setCollapsed(false);
    closeAllPanels();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch('http://localhost:3005/sns-user/unread-count', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUnreadCount(data.count || 0);
      })
      .catch(err => console.error("알림 개수 불러오기 실패:", err));
  }, []);

  const slideLeftOffset = hideText ? drawerWidthCollapsed : drawerWidthExpanded;

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: hideText ? drawerWidthCollapsed : drawerWidthExpanded,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: hideText ? drawerWidthCollapsed : drawerWidthExpanded,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between' // 상단/하단 분리
          },
        }}
      >
        {/* 상단 메뉴 */}
        <Box>
          <Toolbar />
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            {hideText
              ? <Instagram sx={{ fontSize: 24 }} />
              : <Typography variant="h5">Instagram</Typography>}
          </Box>
          <List>
            <ListItem button component={Link} to="/feed" onClick={handleHomeClick}>
              <ListItemIcon><Home /></ListItemIcon>
              {!hideText && <ListItemText primary="홈" />}
            </ListItem>
            <ListItem button onClick={handleSearchClick}>
              <ListItemIcon><Search /></ListItemIcon>
              {!hideText && <ListItemText primary="검색" />}
            </ListItem>
            <ListItem button component={Link} to="/dm">
              <ListItemIcon><MailOutlineIcon /></ListItemIcon>
              {!hideText && <ListItemText primary="메시지" />}
            </ListItem>
            <ListItem button onClick={handleNotiClick}>
              <ListItemIcon>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </ListItemIcon>
              {!hideText && <ListItemText primary="알림" />}
            </ListItem>
            <ListItem button onClick={() => setOpenRegister(true)}>
              <ListItemIcon><AddBoxIcon /></ListItemIcon>
              {!hideText && <ListItemText primary="만들기" />}
            </ListItem>
            <ListItem button component={Link} to="/mypage">
              <ListItemIcon><AccountCircle /></ListItemIcon>
              {!hideText && <ListItemText primary="프로필" />}
            </ListItem>
          </List>
        </Box>

        {/* 하단 메뉴 */}
        <Box>
           <List>
            <MoreMenu />
          </List>
        </Box>
      </Drawer>

      {/* 검색 슬라이드 패널 */}
      <Slide direction="right" in={isSearchOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: slideLeftOffset,
            width: 320,
            bgcolor: '#fff',
            boxShadow: 3,
            zIndex: 1201,
            overflowY: 'auto',
          }}
        >
          <Toolbar />
          <SearchPanel />
        </Box>
      </Slide>

      {/* 알림 슬라이드 패널 */}
      <Slide direction="right" in={openNoti} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: slideLeftOffset,
            width: 320,
            bgcolor: '#fff',
            boxShadow: 3,
            zIndex: 1201,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
            <Typography variant="h6" fontWeight="bold">알림</Typography>
            <IconButton><CloseIcon /></IconButton>
          </Toolbar>
          <Divider />
           <NotificationPanel open={openNoti} onClose={() => setOpenNoti(false)} />
        </Box>
      </Slide>

      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onSuccess={() => setOpenRegister(false)}
      />
    </>
  );
}

export default Menu;
