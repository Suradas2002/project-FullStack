import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';

const MenuComponent: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    
     
    if (token) {
      setLoggedIn(true);
      setIsAdmin(role === 'admin');
      setUsername(storedUsername || '');
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username')
    setLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    navigate('/homepage');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        <ListItem component="button" onClick={() => handleNavigate('/homepage')}>
          <ListItemText primary="LOGO BRAND" />
        </ListItem>
        <ListItem component="button" onClick={() => handleNavigate('/homepage?scrollTo=home')}>
          <ListItemText primary="หน้าแรก" />
        </ListItem>
        <ListItem component="button" onClick={() => handleNavigate('/homepage?scrollTo=about')}>
          <ListItemText primary="เกี่ยวกับเรา" />
        </ListItem>
        <ListItem component="button" onClick={() => handleNavigate('/service')}>
          <ListItemText primary="บริการของเรา" />
        </ListItem>
        <ListItem component="button" onClick={() => handleNavigate('/homepage?scrollTo=work')}>
          <ListItemText primary="ผลงานของเรา" />
        </ListItem>
        <ListItem component="button" onClick={() => handleNavigate('/homepage?scrollTo=contact')}>
          <ListItemText primary="ติดต่อเรา" />
        </ListItem>
        {!loggedIn ? (
          <>
            <ListItem component="button" onClick={() => handleNavigate('/register')}>
              <ListItemText primary="สมัครสมาชิก" />
            </ListItem>
            <ListItem component="button" onClick={() => handleNavigate('/login')}>
              <ListItemText primary="เข้าสู่ระบบ" />
            </ListItem>
          </>
        ) : (
          <>
            {isAdmin && (
              <ListItem component="button" onClick={() => handleNavigate('/adminpage')}>
                <ListItemText primary="Go to Admin Page" />
              </ListItem>
            )}
            <ListItem component="button" onClick={handleLogout}>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              <Button sx={{ borderRadius: 3 }} color="inherit" component={Link} to="/homepage">LOGO BRAND</Button>
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button sx={{ borderRadius: 3 }} color="inherit" component={Link} to="/homepage?scrollTo=home">หน้าแรก</Button>
            <Button sx={{ borderRadius: 3 }} color="inherit" component={Link} to="/homepage?scrollTo=about">เกี่ยวกับเรา</Button>
            <Button sx={{ borderRadius: 3 }} color="inherit" component={Link} to="/service">บริการของเรา</Button>
            <Button sx={{ borderRadius: 3 }} color="inherit" component={Link} to="/homepage?scrollTo=work">ผลงานของเรา</Button>
            <Button sx={{ borderRadius: 3 }} color="inherit" component={Link} to="/homepage?scrollTo=contact">ติดต่อเรา</Button>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0, position: 'sticky' ,flexDirection:'column',mt:2}}>
            <Avatar alt="User Avatar"  src="/path-to-image.jpg"onClick={handleMenuOpen}sx={{ cursor: 'pointer' }}/>
            <Typography variant="body2"sx={{color: 'text.secondary',mt: 0.5 }}>
              {username}
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{ sx: { width: 200 } }}
          >
           
              {loggedIn ? (
                
                  [
                      isAdmin && (
                          <MenuItem key="admin" onClick={() => { navigate('/adminpage'); handleMenuClose(); }}>Go to Admin Page</MenuItem>
                      ),
                      <MenuItem key="logout" onClick={() => { handleLogout(); handleMenuClose(); }}>ออกจากระบบ</MenuItem>
                  ]
              ) : (
                  [
                      <MenuItem key="register" onClick={() => { navigate('/register'); handleMenuClose(); }}>สมัครสมาชิก</MenuItem>,
                      <MenuItem key="login" onClick={() => { navigate('/login'); handleMenuClose(); }}>เข้าสู่ระบบ</MenuItem>
                  ]
              )}
          </Menu>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', width: '100%', position: 'fixed' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Avatar
                alt="User Avatar"
                src="/path-to-image.jpg"
                sx={{ mr: 5 }}
                onClick={handleMenuOpen}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default MenuComponent;
