import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface CarCreatePopupProps {
    fetchCars: () => Promise<void>;
    open: boolean;
    onClose: () => void;
    car?: {
        _id: string;
        typename: string;
        numOfSeats: number;
        price_per_day: number;
        stock: number;
        field: string;
        photo?: string;  // เพิ่มฟิลด์ photo
    };
    isEdit?: boolean;
}

const CarCreatePopup: React.FC<CarCreatePopupProps> = ({ fetchCars, open, onClose, car, isEdit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEdit && car) {
            reset(car); 
        }
    }, [isEdit, car, reset]);

    const onSubmit = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found, please log in again.');
            return;
        }

        const formData = new FormData();
        if (file) {
            formData.append('photo', file); // อัปโหลดไฟล์ภาพ
        }

        // เพิ่มข้อมูลอื่นๆ ใน FormData
        Object.entries(data).forEach(([key, value]) => {
            // ตรวจสอบประเภทของ value และแน่ใจว่ามันไม่เป็น null
            if (value !== null) {
                formData.append(key, value as string); // ใช้ type assertion ที่นี่
            }
        });

        if (isEdit && car) {
            await axios.patch(`http://localhost:8080/api/v1/cars/${car._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Car updated successfully!');
        } else {
            await axios.post('http://localhost:8080/api/v1/cars', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Car created successfully!');
        }

        await fetchCars(); 
        onClose();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save car');
    }
};

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]); // เก็บไฟล์ที่เลือก
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isEdit ? 'Edit Car' : 'Create a New Car'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Car Type"
                        fullWidth
                        margin="normal"
                        {...register('typename', { required: 'Car type is required' })}
                        error={!!errors.typename}
                        helperText={typeof errors.price_per_day?.message === 'string' ? errors.price_per_day.message : ''}
                    />
                    <TextField
                        label="Number of Seats"
                        fullWidth
                        margin="normal"
                        type="number"
                        {...register('numOfSeats', { required: 'Number of seats is required', min: 1 })}
                        error={!!errors.numOfSeats}
                        helperText={typeof errors.price_per_day?.message === 'string' ? errors.price_per_day.message : ''}
                    />
                    <TextField
                        label="Price per Day"
                        fullWidth
                        margin="normal"
                        type="number"
                        {...register('price_per_day', { required: 'Price per day is required', min: 0 })}
                        error={!!errors.price_per_day}
                        helperText={typeof errors.price_per_day?.message === 'string' ? errors.price_per_day.message : ''}
                    />
                    <TextField
                        label="Stock"
                        fullWidth
                        margin="normal"
                        type="number"
                        {...register('stock', { required: 'Stock is required', min: 0 })}
                        error={!!errors.stock}
                        helperText={typeof errors.price_per_day?.message === 'string' ? errors.price_per_day.message : ''}
                    />
                    <TextField
                        label="Field"
                        fullWidth
                        margin="normal"
                        {...register('field', { required: 'Field is required' })}
                        error={!!errors.field}
                        helperText={typeof errors.price_per_day?.message === 'string' ? errors.price_per_day.message : ''}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />

                    <DialogActions>
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CarCreatePopup;

