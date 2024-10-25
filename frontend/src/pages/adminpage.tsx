import { Box } from '@mui/material';


import { Outlet } from 'react-router-dom';
import AdminMenu from '../components/menu/adminmenu';

const AdminPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminMenu />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default AdminPage;
