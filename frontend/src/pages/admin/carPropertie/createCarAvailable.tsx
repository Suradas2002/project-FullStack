import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import axios, { AxiosError } from 'axios';

const CreateCarAvailable = ({ open, onClose, carId }:any) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stock, setStock] = useState(0);
    
   const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:8080/api/v1/car-availability/add`, {
            carId,
            startDate,
            endDate,
            stock,
            available: true
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert('Car availability added successfully!');
        onClose(); 
    } catch (error) {
        console.error('Error adding car availability:', error);

        // ตรวจสอบประเภทของ error ว่าเป็น AxiosError หรือไม่
        if (error instanceof AxiosError) {
            // ตรวจสอบว่ามีข้อผิดพลาดจากการซ้ำกันของช่วงเวลา
            if (error.response && error.response.status === 409) {
                const conflictingAvailability = error.response.data.conflictingAvailability;
                alert(`ช่วงเวลาที่ซ้ำกัน: ${conflictingAvailability.start_date} ถึง ${conflictingAvailability.end_date}`);
            } else {
                alert('Failed to add car availability');
            }
        } else {
            alert('An unknown error occurred');
        }
    }
};

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Car Availability</DialogTitle>
            <DialogContent>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCarAvailable;
