import React, { useEffect, useState } from 'react';
import { Box, Grid, Button } from '@mui/material'; // เพิ่ม Button
import axios from 'axios';
import CarCreatePopup from './carPropertie/carcreatePopup';
import CardCarCreate from './carPropertie/cadcarcreate';

const CreateCar = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [carToEdit, setCarToEdit] = useState<any | null>(null);
    const [openPopup, setOpenPopup] = useState(false);

    const fetchCars = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/v1/cars', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCars(response.data.cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleEditCar = (car: any) => {
        setCarToEdit(car); // ส่งรถที่จะทำการแก้ไข
        setOpenPopup(true); // เปิด popup
    };

    const handleCreateCar = () => {
        setCarToEdit(null); // ไม่มีการส่งรถเพื่อแก้ไข กำหนดเป็น null
        setOpenPopup(true); // เปิด popup สำหรับการสร้าง
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setCarToEdit(null); // รีเซ็ตข้อมูลเมื่อปิด popup
    };

    return (
        <Box>
            {/* ปุ่มสำหรับการสร้างรถใหม่ */}
            <Button variant="contained" color="primary" onClick={handleCreateCar}>
                Create Car
            </Button>

            <CarCreatePopup 
                open={openPopup} 
                onClose={handleClosePopup} 
                fetchCars={fetchCars} 
                car={carToEdit} 
                isEdit={!!carToEdit} // ถ้า `carToEdit` ไม่ใช่ `null` ให้เป็นโหมดแก้ไข
            /> 
            
            <Grid container spacing={2}>
                {cars.map((car) => (
                    <Grid item xs={12} sm={6} md={2} key={car._id}>
                        <CardCarCreate 
                            car={car} 
                            fetchCars={fetchCars} 
                            onEdit={handleEditCar} // ส่งฟังก์ชันแก้ไขไปให้
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CreateCar;
