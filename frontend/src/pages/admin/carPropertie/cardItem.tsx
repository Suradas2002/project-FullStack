import { Box, Button, Typography } from '@mui/material';
import React from 'react';

interface CartItem {
    car: {
        carId: string;
        typename: string;
        price_per_day: number;
        numOfSeats: number;
    };
    quantity: number;
}

interface CartItemsProps {
    cart: CartItem[];
    handleRemoveFromCart: (carId: string) => void;
    calculateTotalPrice: () => number; 
    fromDate: string; 
    toDate: string; 
    isPaymentPage?: boolean; // เพิ่ม prop นี้
}

const CartItems: React.FC<CartItemsProps> = ({ cart, handleRemoveFromCart, calculateTotalPrice, fromDate, toDate, isPaymentPage }) => {
    const calculateRentalDays = () => {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        const days = (toDateObj.getTime() - fromDateObj.getTime()) / (1000 * 60 * 60 * 24);
        return days > 0 ? days : 1; 
    };

    const rentalDays = calculateRentalDays();

    return (
        <Box>
            {cart.length === 0 ? (
                <Typography>ยังไม่มีรถในตะกร้า</Typography>
            ) : (
                <>
                    <Typography variant="h6" mb={2}>จำนวนวันเช่า: {rentalDays} วัน</Typography>
                    {cart.map((item, index) => {
                            const car = item.car; // สร้างตัวแปรสำหรับ car
                            return (
                                <Box key={car?.carId || index} display="flex" flexDirection="column" mb={2}>
                                    <Typography variant="subtitle1">
                                        ชื่อรถ: {car ? car.typename : 'ไม่พบข้อมูลรถ'} - จำนวน: {item.quantity} คัน
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        ราคา: {car ? car.price_per_day : 'N/A'} ฿ / คัน, ที่นั่ง: {car ? car.numOfSeats : 'N/A'} ที่นั่ง
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary">
                                        ราคารวม (สำหรับ {item.quantity} คัน): {car ? car.price_per_day * item.quantity * rentalDays : 'N/A'} ฿
                                    </Typography>
                                    {!isPaymentPage && (
                                        <Button variant="outlined" color="secondary" sx={{ width: '100px', height: '40px' }} onClick={() => handleRemoveFromCart(car?.carId)}>
                                            ลบ
                                        </Button>
                                    )}
                                </Box>
                                 );
                        })}
                </>
            )}
            {cart.length > 0 && (
                <Box mt={2}>
                    <Typography variant="h6">ยอดรวมทั้งหมด: {calculateTotalPrice()} ฿</Typography>
                </Box>
            )}
        </Box>
    );
};

export default CartItems;
