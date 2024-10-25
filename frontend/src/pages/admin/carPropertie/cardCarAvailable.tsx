import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, CardMedia, TextField } from '@mui/material';

interface CarProps {
    car: {
        _id: string;
        typename: string;
        numOfSeats: number;
        price_per_day: number;
        stock: number;
        field: string;
        availableStock: number; 
        photo: string;
    };
    onAddToCart: (car: any, quantity: number) => void; 
}

const CardCarAvailable: React.FC<CarProps> = ({ car, onAddToCart }) => {
    const [quantity, setQuantity] = useState<number>(0); 

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Math.min(car.availableStock, Number(event.target.value))); 
        setQuantity(value);
    };
    const handleAddToCart = () => {
        if (quantity > 0) {
            onAddToCart(car, quantity); 
            setQuantity(0); 
        } else {
            alert('กรุณากรอกจำนวนรถที่ต้องการเช่า');
        }
    };

    return (
        <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', maxWidth: 300 }}>
            {car.photo && (
                <CardMedia
                    component="img"
                    height="200"
                    image={car.photo}
                    alt={`Photo of ${car.typename}`}
                    sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                />
            )}

            <CardContent sx={{ padding: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h6" fontWeight="bold" color="textPrimary" gutterBottom>
                         เช่า {car.typename}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        จำนวน {car.numOfSeats} ที่นั่ง
                    </Typography>
                </Box>
                
               <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h5" color="textPrimary" fontWeight="bold" gutterBottom>
                        {car.price_per_day} ฿
                    </Typography>
                        <Box display="flex" alignItems="center">
                            <TextField
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                inputProps={{
                                    min: 0,
                                    max: car.availableStock,
                                }}
                                sx={{ 
                                    width: '60px', 
                                    marginRight: 1,  
                                    '& .MuiInputBase-root': { 
                                        height: '40px', 
                                    } 
                                }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleAddToCart}
                                sx={{ 
                                    height: '40px', 
                                    minWidth: '80px' 
                                }}
                            >
                                เพิ่ม
                            </Button>
                        </Box>
                    </Box>

                <Typography color="textSecondary" mt={2}  display="flex" justifyContent="flex-end" >
                    จำนวนคันที่เหลือ {car.availableStock} คัน
                </Typography>
                <Typography variant="h5" color="textPrimary" fontWeight="bold" gutterBottom>
                    {car.field} 
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CardCarAvailable;
