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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:963px)');

  const hideText = collapsed || isMobile;

  const toggleMenu = (collapse = true) => {
    setCollapsed(collapse);
  };

  const handleSearchClick = () => {
    toggleMenu(true);
    setIsSearchOpen(true);
  };

  const handleHomeClick = () => {
    toggleMenu(false);
    setIsSearchOpen(false);
  };

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
          },
        }}
      >
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

          <ListItem button onClick={() => setOpenRegister(true)}>
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            {!hideText && <ListItemText primary="만들기" />}
          </ListItem>

          <ListItem button component={Link} to="/mypage">
            <ListItemIcon><AccountCircle /></ListItemIcon>
            {!hideText && <ListItemText primary="프로필" />}
          </ListItem>
        </List>
      </Drawer>

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

      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onSuccess={() => setOpenRegister(false)}
      />
    </>
  );
}

export default Menu;
