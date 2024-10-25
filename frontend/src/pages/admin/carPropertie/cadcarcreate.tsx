import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, CardMedia } from '@mui/material';
import axios from 'axios';
import CreateCarAvailable from './createCarAvailable';


interface CarProps {
    car: {
        _id: string;
        typename: string;
        numOfSeats: number;
        price_per_day: number;
        stock: number;
        field: string;
        photo: string;
    };
    fetchCars: () => Promise<void>; 
    onEdit: (car: any) => void; 
}

const CardCarCreate: React.FC<CarProps> = ({ car, fetchCars, onEdit }) => {
    const [openPopup, setOpenPopup] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/v1/cars/${car._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Car deleted successfully!');
                await fetchCars();
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Failed to delete car');
            }
        }
    };

    return (
        <Card sx={{ boxShadow: 3, borderRadius: 3, overflow: 'hidden' }}>
            {/* ส่วนการแสดงรูปภาพ */}
            {car.photo && (
                <CardMedia
                    component="img"
                    height="200"
                    image={car.photo}
                    alt={`Photo of ${car.typename}`}
                    sx={{ objectFit: 'cover' }}
                />
            )}

            <CardContent sx={{ padding: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                    {car.typename}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Seats: {car.numOfSeats}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Price per Day: {car.price_per_day} ฿
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Stock: {car.stock}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Field: {car.field}
                </Typography>
                
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => onEdit(car)}
                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleDelete}
                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                    >
                        Delete
                    </Button>
                </Box>
                <Box mt={2} display="flex" justifyContent="center">
                    <Button  
                        variant="contained" 
                        color="secondary" 
                        onClick={() => setOpenPopup(true)}
                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                    >
                        Add Availability
                    </Button>
                </Box>
            </CardContent>

            <CreateCarAvailable 
                open={openPopup} 
                onClose={() => setOpenPopup(false)} 
                carId={car._id} 
            />
        </Card>
    );
};

export default CardCarCreate;