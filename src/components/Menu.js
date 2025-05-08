import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemText, Typography, Toolbar, ListItemIcon
} from '@mui/material';
import { Home, Search, AccountCircle } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from 'react-router-dom';
import RegisterDialog from './RegisterDialog';

function Menu() {
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          SNS 메뉴
        </Typography>
        <List>
          <ListItem button component={Link} to="/feed">
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="홈" />
          </ListItem>
          <ListItem button component={Link} to="/search">
            <ListItemIcon><Search /></ListItemIcon>
            <ListItemText primary="검색" />
          </ListItem>
          <ListItem button component={Link} to="/dm">
            <ListItemIcon><MailOutlineIcon /></ListItemIcon>
            <ListItemText primary="메시지" />
          </ListItem>
          <ListItem button onClick={() => setOpenRegister(true)}>
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            <ListItemText primary="만들기" />
          </ListItem>
          <ListItem button component={Link} to="/mypage">
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="프로필" />
          </ListItem>
        </List>
      </Drawer>

      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onSuccess={() => {
          setOpenRegister(false);
        }}
      />
    </>
  );
}

export default Menu;
