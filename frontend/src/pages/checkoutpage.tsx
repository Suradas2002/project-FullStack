import { Box, Typography } from '@mui/material';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { useLocation } from 'react-router-dom';
import CartItems from './admin/carPropertie/cardItem';

const CheckoutPage = () => {
    const location = useLocation();
    

    return (
        <Box display={'flex' } alignItems={'center'}>
            <Typography variant="h4">การชำระเงินเสร็จสมบูรณ์</Typography>
        </Box>
    );
};

export default CheckoutPage