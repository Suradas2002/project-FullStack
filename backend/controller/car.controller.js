import CarModel from "../model/car.js"
import { v2 as cloudinary } from "cloudinary"
import * as dotenv from 'dotenv'

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const createCar = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files were uploaded." });
        }

        // อัพโหลดไฟล์แรก
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.secure_url); // ส่งกลับ URL ของไฟล์
            });
            stream.end(req.files[0].buffer); // ใช้ไฟล์แรกในการอัพโหลด
        });

        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can create cars" });
        }

        const { stock, ...carData } = req.body;

        // ตรวจสอบว่า stock มากกว่า 0
        if (stock <= 0) {
            return res.status(400).json({ message: "Stock must be greater than 0" });
        }

        // สร้าง car ใหม่
        const newCar = new CarModel({ ...carData, stock, photo: result }); // ใช้ URL ของไฟล์แรก
        await newCar.save();
        res.status(201).json(newCar);

    } catch (error) {
        console.error("Error creating car:", error);
        res.status(500).json({ error: error.message });
    }
};

const updateCar = async (req, res) => {
    try {
        const { user } = req;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can update cars" });
        }

        const { stock } = req.body; // รับข้อมูล stock จาก body

        if (stock < 0) {
            return res.status(400).json({ message: "Stock must be greater than or equal to 0" });
        }

        // ตรวจสอบว่ามีการอัปโหลดไฟล์ใหม่หรือไม่
        let updatedData = { ...req.body }; // เริ่มต้นด้วยข้อมูลจาก req.body

        if (req.files && req.files.length > 0) {
            // อัปโหลดไฟล์ใหม่ไปยัง Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result.secure_url); // ส่งกลับ URL ของไฟล์
                });
                stream.end(req.files[0].buffer); // ใช้ไฟล์แรกในการอัปโหลด
            });

            // อัปเดต URL รูปภาพใน updatedData
            updatedData.photo = result; // อัปเดต URL รูปภาพใหม่
        }

        // อัปเดตข้อมูลรถในฐานข้อมูล
        const updatedCar = await CarModel.findByIdAndUpdate(
            req.params.carId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedCar) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json(updatedCar);
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({ error: error.message });
    }
};




const deleteCar = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete cars" });
        }

        const car = await CarModel.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        if (car.stock > 0) {
            await CarModel.findByIdAndDelete(req.params.carId);
            res.status(200).json({ message: "Car deleted" });
        } else {
            res.status(400).json({ message: "Car cannot be deleted because it is still in stock" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getCars = async (req, res) => {
    try {
        const cars = await CarModel.find();
        res.status(200).json({ cars });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCarById = async (req, res) => {
    try {
        const { carId } = req.params;
        const car = await CarModel.findById(carId);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        res.status(200).json({ car });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export {
    createCar,
    updateCar,
    deleteCar,
    getCars,
    getCarById,

};
