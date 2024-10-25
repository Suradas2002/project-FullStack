import BookingModel from "../model/booking.js";
import CarModel from "../model/car.js";
import CustomerModel from "../model/customer.js";
import { checkCarAvailable, updateCarAvailable } from "./car.available.controller.js";


const calculateBooking = async (cars, fromDate, toDate) => {
    const days = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);
    const rentalDays = days > 0 ? days : 1;
    let totalAmount = 0;

    console.log('Calculating booking amount...');
    for (const car of cars) {
        const carData = await CarModel.findById(car.carId);
        if (!carData) {
            throw new Error(`Car with ID ${car.carId} not found`);
        }
        const pricePerDay = carData.price_per_day;

        if (isNaN(pricePerDay) || isNaN(car.stock) || isNaN(rentalDays)) {
            throw new Error(`Invalid data for calculation. PricePerDay: ${pricePerDay}, Stock: ${car.stock}, Days: ${days}`);
        }

        console.log(`Car ID: ${car.carId}, PricePerDay: ${pricePerDay}, Stock: ${car.stock}, Days: ${days}`);
        totalAmount += pricePerDay * car.stock * rentalDays;
    }

    console.log(`Total Amount Calculated: ${totalAmount}`);
    return totalAmount;
};

const createBooking = async (req, res) => {
    try {
        const { fromDate, toDate, customer_ID, customerDetails, cars, description } = req.body;

        if (!cars || cars.length === 0) {
            return res.status(400).json({ error: "No cars provided in the booking request" });
        }

        // ตรวจสอบความพร้อมใช้งานของรถยนต์
        for (const car of cars) {
            const { carId, stock } = car;
            const isAvailable = await checkCarAvailable(carId, fromDate, toDate, stock);

            if (!isAvailable) {
                return res.status(400).json({ error: `Car ${carId} is not available` });
            }
        }

        let customerId = customer_ID;

        // ถ้าไม่มี customerId, ค้นหาลูกค้าจากอีเมล
        if (!customerId) {
            const existingCustomer = await CustomerModel.findOne({ email: customerDetails.email });

            if (existingCustomer) {
                customerId = existingCustomer._id;
            } else {
                const newCustomer = new CustomerModel(customerDetails);
                const savedCustomer = await newCustomer.save();
                customerId = savedCustomer._id;
            }
        }

        // คำนวณจำนวนเงิน
        const amount = await calculateBooking(cars, fromDate, toDate);
        const numberOfCars = cars.reduce((total, car) => total + car.stock, 0);

        // สร้างการจอง
        const booking = new BookingModel({
            fromDate,
            toDate,
            customer_ID: customerId,
            cars,
            description,
            amount,
            numberOfCars
        });

        await booking.save();


        res.status(201).json({
            bookingId: booking._id,
            message: "Booking created successfully!",
            bookingDetails: booking
        });
        console.log(booking._id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message }); // ใช้ status 500 สำหรับข้อผิดพลาดที่ไม่คาดคิด
    }
};





const cancelBooking = async (req, res) => {
    try {
        const user = req.user;
        const { bookingId } = req.params;

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can cancel bookings" });
        }

        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await Promise.all(booking.cars.map(async (car) => {
            await updateCarAvailable(car.carId, booking.fromDate, booking.toDate, 1, true);
        }));

        await BookingModel.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const updateData = req.body;


        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

        const booking = await BookingModel.findByIdAndUpdate(bookingId, updateData, { new: true });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });



        res.status(200).json({ booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export {
    createBooking,
    cancelBooking,
    updateBooking
};