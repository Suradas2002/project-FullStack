import { Box, Grid, TextField, Button, Typography, IconButton, Badge, Drawer } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { useEffect, useState } from 'react';
import CardCarAvailable from './admin/carPropertie/cardCarAvailable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CartItems from './admin/carPropertie/cardItem';
import { debounce } from 'lodash';

// สร้าง interface สำหรับ CartItem
interface CartItem {
    car: {
        carId: string;
        typename: string;
        price_per_day: number;
        numOfSeats: number;
    };
    quantity: number;
}

const Service = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [cart, setCart] = useState<CartItem[]>([]); // ใช้ CartItem แทน any
    const [openCart, setOpenCart] = useState<boolean>(false);

    // ฟังก์ชันในการดึงข้อมูลรถ
    const fetchCars = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/v1/car-availability?fromDate=${fromDate}&toDate=${toDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // ตรวจสอบว่ามีรถว่างหรือไม่
            if (response.data.length === 0) {
                setCars([]); // ตั้งค่า cars ให้เป็น array ว่าง
                return;
            }

            // กรองเฉพาะรถที่มี stock มากกว่า 0
            const filteredCars = response.data.filter((car: any) => car.availableStock > 0);
            setCars(filteredCars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setCars([]);
        }
    };

    
    const debouncedFetchCars = debounce(fetchCars, 300); 

    
    useEffect(() => {
        debouncedFetchCars();
        return () => {
            debouncedFetchCars.cancel(); 
        };
    }, [fromDate, toDate]);

    const handleAddToCart = (car: any, quantity: number) => {
        if (quantity <= 0) return;

        setCart((prevCart) => {
            const existingCar = prevCart.find(item => item.car.carId === car.carId);
            if (existingCar) {
                return prevCart.map(item => 
                    item.car.carId === car.carId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { car, quantity }];
            }
        });
    };

    const handleRemoveFromCart = (carId: string) => {
        setCart(prevCart => prevCart.filter(item => item.car.carId !== carId));
    };

    const calculateTotalPrice = () => {
        const fromDateObj = new Date(fromDate); 
        const toDateObj = new Date(toDate); 
        const days = (toDateObj.getTime() - fromDateObj.getTime()) / (1000 * 60 * 60 * 24) +1;
        const rentalDays = days > 0 ? days : 1; 
         console.log('Rental Days:', rentalDays); // ตรวจสอบจำนวนวันเช่า
        console.log('Cart Items:', cart); // ตรวจสอบข้อมูลในตะกร้า
        
        return cart.reduce((total: number, item: CartItem) => {
            return total + item.car.price_per_day * item.quantity * rentalDays;
        }, 0);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="center" mb={2}>
                <TextField
                    type="date"
                    label="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="date"
                    label="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <IconButton aria-label="cart" style={{ marginLeft: '20px' }} onClick={() => setOpenCart(true)}>
                    <Badge badgeContent={cart.length} color="primary">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </Box>

            <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                {cars.length === 0 ? (
                    <Typography variant="h6" color="error">
                        ไม่มีรถว่างในช่วงเวลาที่คุณเลือก
                    </Typography>
                ) : (
                    cars.map((car, index) => (
                        <Grid item xs={12} sm={6} md={2} key={`${car._id}-${index}`}>
                            <CardCarAvailable car={car} onAddToCart={handleAddToCart} />
                        </Grid>
                    ))
                )}
            </Grid>

            <Drawer anchor="right" open={openCart} onClose={() => setOpenCart(false)}>
                <Box sx={{ width: 300, padding: 2 }}>
                    <Typography variant="h6">ตะกร้าของคุณ</Typography>
                    <CartItems 
                        cart={cart}
                        handleRemoveFromCart={handleRemoveFromCart}
                        calculateTotalPrice={calculateTotalPrice}
                        fromDate={fromDate} 
                        toDate={toDate}     
                    />
                    {cart.length > 0 && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            component={Link} 
                            to="/service/bookingpage" 
                            state={{ fromDate, toDate, cars: cart }} // ส่งข้อมูลที่จำเป็น
                        >
                            ดำเนินการต่อ
                        </Button>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
};

export default Service;
