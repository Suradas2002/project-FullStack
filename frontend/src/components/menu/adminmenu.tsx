import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Divider, Drawer, Box } from '@mui/material';

const AdminMenu: React.FC = () => {
  return (
    <Box
  sx={{
    width: 250,
    height: '100vh', 
    flexShrink: 0,
    backgroundColor: '#fcfc', 
    paddingTop: '20px', 
  }}
>
  <List>
    <ListItemButton component={Link} to="/adminpage/createcar">
      <ListItemText primary="สร้างรถ" />
    </ListItemButton>
    <ListItemButton component={Link} to="/adminpage/setcar">
      <ListItemText primary="กำหนดวันของรถ" />
    </ListItemButton>
    <ListItemButton component={Link} to="/adminpage/rentalreport">
      <ListItemText primary="หน้ารายงานการเช่า" />
    </ListItemButton>
  </List>
</Box>

     
      
    
  );
};

export default AdminMenu;
