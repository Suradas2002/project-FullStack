import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import CartItems from './admin/carPropertie/cardItem';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fromDate, toDate, cars } = location.state || { fromDate: '', toDate: '', cars: [] };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        fromDate: fromDate,
        toDate: toDate,
        cars: cars,
        description: ''
    });

    const [cart, setCart] = useState(cars);  
    const [existingCustomer, setExistingCustomer] = useState(null); 

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRemoveFromCart = (carId: any) => {
        setCart((prevCart: any[]) => prevCart.filter((item) => item.car.carId !== carId));
    };

    const calculateTotalPrice = () => {
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const days = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    const rentalDays = days > 0 ? days : 1; 

    return cart.reduce((total: number, item: { car: { price_per_day: number; }; quantity: number; }) => 
        total + item.car.price_per_day * item.quantity * rentalDays, 0
    );
};

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
        const amount = calculateTotalPrice();
        const bookingData = {
    fromDate: formData.fromDate,
    toDate: formData.toDate,
    cars: cart.map((car: { car: { carId: any; typename: any; numOfSeats: any; price_per_day: any; }; quantity: any; }) => ({
        carId: car.car.carId,
        typename: car.car.typename,
        numOfSeats: car.car.numOfSeats, 
        price_per_day: car.car.price_per_day,
        stock: car.quantity,
    })),
    customerDetails: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
    },
    description: formData.description,
    amount: amount,
};

        // ส่งข้อมูลไปยัง API เพื่อสร้างการจอง
        const response = await axios.post('http://localhost:8080/api/v1/bookings', bookingData);
        console.log("Response from booking API:", response.data);
        if (response.status === 201) {
            const { bookingId } = response.data; 
            console.log("Booking ID:", bookingId);
            navigate('/service/paymentpage', { 
                state: { 
                    bookingData: {
                        ...bookingData, 
                        bookingId: bookingId, 
                    }
                } 
            });
        }
    } catch (error) {
        if (axios.isAxiosError(error)) { 
            alert(`Error: ${error.response ? error.response.data.error : error.message}`);
        } else {
            alert('An unexpected error occurred.');
        }
    }
};


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Booking Form
            </Typography>
            <Grid container spacing={2}>
                {/* ข้อมูลส่วนบุคคล */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* From Date */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="From Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* To Date */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="To Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Cars */}
                <Grid item xs={12}>
                    <CartItems 
                        cart={cart} 
                        handleRemoveFromCart={handleRemoveFromCart} 
                        calculateTotalPrice={calculateTotalPrice} 
                        fromDate={fromDate} // ส่ง fromDate
                        toDate={toDate}     // ส่ง toDate
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        ชำระเงิน
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingPage;
