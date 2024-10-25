import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Typography, Grid } from '@mui/material';

import CartItems from './admin/carPropertie/cardItem';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from './Properties/paymentfrom';

const stripePromise = loadStripe('pk_test_51Px60eKNwhbz9UQBff8EU8f6d9Xx4RB3htmFcqrBrvJDNqVq9m8ZuMpfs3cJ23aVqe6IF9jZpAT8gCKCDeuMupEB001gm7DXpW');

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingData } = location.state || { bookingData: {} }; 
    const { bookingId, cars, amount, fromDate, toDate } = bookingData || {}; 
    
    console.log(amount);
    
   
    useEffect(() => {
        if (!bookingId) {
            console.error("Booking ID not received.");
            navigate('/error-page'); // ถ้าไม่มี bookingId ให้เปลี่ยนเส้นทางไปที่หน้า error
        }
        console.log("Received Booking ID:", bookingId);
    }, [bookingId, navigate]);
    
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    
    useEffect(() => {
    if (bookingData) {
        
        const formattedCart = bookingData.cars.map((car: { carId: any; typename: any; price_per_day: any; numOfSeats: any; stock: any; }) => ({
    car: {
        carId: car.carId,
        typename: car.typename,
        price_per_day: car.price_per_day,
        numOfSeats: car.numOfSeats 
    },
    quantity: car.stock,
    }));
        setCart(formattedCart);
        setTotalAmount(bookingData.amount || 0);
    }
}, [bookingData]);
    console.log(cars);
    
    const handlePaymentSuccess = () => {
        console.log("Payment was successful!");
        navigate('/service/checkoutpage', { state: { cart } });
    };
    
    return (
        <Elements stripe={stripePromise}>
            <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom align="center" color="#333">
                    การชำระเงินสำหรับการจองรถ
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: '#fff' }}>
                            <Typography variant="h6" gutterBottom>
                                รายการรถที่จอง
                            </Typography>
                            <CartItems 
                                cart={cart}
                                handleRemoveFromCart={() => {}} // ฟังก์ชันนี้ไม่ถูกใช้งานในหน้า Payment
                                calculateTotalPrice={() => totalAmount} 
                                fromDate={fromDate} // ส่งวันที่
                                toDate={toDate}     // ส่งวันที่
                                isPaymentPage={true} // ส่ง prop ว่าเป็นหน้า Payment Page
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: '#fff' }}>
                            <PaymentForm 
                                totalAmount={totalAmount}
                                onPaymentSuccess={handlePaymentSuccess}
                                bookingId={bookingId} // ส่ง bookingId
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Elements>
    );
};

export default PaymentPage;
