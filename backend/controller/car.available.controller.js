import CarAvailableModel from "../model/car.available.js";
import CarModel from "../model/car.js";



const checkCarAvailable = async (carId, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ค้นหา availability ที่ครอบคลุมช่วงเวลาการจองที่ต้องการ
    const availability = await CarAvailableModel.find({
        car_FK: carId,
        start_date: { $lte: end },
        end_date: { $gte: start }
    });

    if (availability.length > 0) {
        let totalAvailableStock = 0; // ตัวแปรสำหรับเก็บสต็อกที่สามารถใช้ได้ทั้งหมด

        for (let av of availability) {
            // ตรวจสอบว่ามีช่วงเวลา overlap หรือไม่
            if (start < av.end_date && end > av.start_date) {
                // ถ้า overlap ให้เพิ่มสต็อกที่มีอยู่
                totalAvailableStock += av.stock;
            }
        }

        if (totalAvailableStock > 0) {
            return { available: true, message: 'สามารถจองได้' };
        } else {
            return { available: false, message: 'stock ไม่เพียงพอสำหรับช่วงวันที่เลือก' };
        }
    } else {
        return { available: false, message: 'ไม่มีข้อมูลการว่างในช่วงเวลาที่เลือก' };
    }
};


const addCarAvailable = async (req, res) => {
    try {
        const { carId, startDate, endDate, stock, available, photo } = req.body;

        const car = await CarModel.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        const existingAvailability = await CarAvailableModel.findOne({
            car_FK: carId,
            $or: [
                //
                {
                    start_date: { $lte: new Date(endDate) },
                    end_date: { $gte: new Date(startDate) },

                },
                {
                    start_date: { $gte: new Date(startDate) },
                    end_date: { $lte: new Date(endDate) },
                },
            ],

        });
        console.log(new Date(endDate));
        console.log(new Date(startDate));

        console.log(startDate);
        console.log(endDate);
        console.log(existingAvailability);
        if (existingAvailability) {

            return res.status(409).json({
                message: "Car availability already exists for this date range",
                conflictingAvailability: {
                    start_date: existingAvailability.start_date,
                    end_date: existingAvailability.end_date,
                },
            });
        }

        const newAvailability = new CarAvailableModel({
            car_FK: carId,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            stock: stock,
            available,
        });

        await newAvailability.save();
        res.status(201).json(newAvailability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to add car availability' });
    }
};

const updateCarAvailable = async (carId, startDate, endDate, quantity, available) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ค้นหา availability ที่มีช่วงครอบคลุมการจอง
    const availability = await CarAvailableModel.find({
        car_FK: carId,
        start_date: { $lte: end },
        end_date: { $gte: start }
    });

    if (availability.length > 0) {
        for (let av of availability) {

            if (av.start_date < start && av.end_date <= end) {

                await CarAvailableModel.create({
                    car_FK: carId,
                    start_date: av.start_date,
                    end_date: new Date(start.getTime() - 86400000),
                    stock: av.stock,
                    available: true
                });
                av.start_date = start
                await av.save();
            }
            if (av.start_date < start && av.end_date > end) {

                await CarAvailableModel.create({
                    car_FK: carId,
                    start_date: av.start_date,
                    end_date: new Date(start.getTime() - 86400000),
                    stock: av.stock,
                    available: true
                });

                await CarAvailableModel.create({
                    car_FK: carId,
                    start_date: new Date(end.getTime() + 86400000),
                    end_date: av.end_date,
                    stock: av.stock,
                    available: av.available
                });


                av.start_date = start;
                av.end_date = end;
                await av.save();

            }

            if (av.start_date >= start && av.end_date > end) {

                await CarAvailableModel.create({
                    car_FK: carId,
                    start_date: new Date(end.getTime() + 86400000), // เริ่มที่วันถัดจากวันที่จองสิ้นสุด
                    end_date: av.end_date, // ยังคงใช้ end_date เดิม
                    stock: av.stock,
                    available: av.available
                });
                av.end_date = end; // อัปเดตช่วงเวลาที่เหลือให้สิ้นสุดในวันที่จองสิ้นสุด
                await av.save();
            }


            // ลด stock ของ availability ปัจจุบัน
            av.stock -= quantity; // ลดสต็อกตามจำนวนที่จอง
            if (av.stock <= 0) {
                av.available = false; // ถ้าไม่มี stock ให้เปลี่ยนสถานะ
            }
            await av.save(); // บันทึกการเปลี่ยนแปลง
            continue
        }

        console.log(`Reduced stock for car ${carId} in the overlapping availability`);
    }


};





//เพิ่มเช็ค backend date 


const getAllCarsAvailable = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        const from = new Date(fromDate);
        const to = new Date(toDate);
        //เพิ่่มคำอธิบาย ทำไมต้องใส่ isnan
        if (isNaN(from) || isNaN(to)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // ตรวจสอบให้แน่ใจว่า toDate ไม่เกินวันที่สุดท้ายที่มีในฐานข้อมูล
        const maxEndDate = await CarAvailableModel.findOne({
            available: true
        }).sort({ end_date: -1 }); // ค้นหาวันสุดท้ายที่มีอยู่ในฐานข้อมูล
        // เพิ่มเช็ค start
        if (maxEndDate && to > maxEndDate.end_date) {
            return res.status(400).json({ message: "End date exceeds available dates" });
        }

        // ค้นหาช่วงเวลาที่มีความว่างของรถซ้อนทับกับช่วงเวลาที่ต้องการจอง
        const carsAvailable = await CarAvailableModel.find({
            start_date: { $lte: to }, // ช่วงเวลาที่เริ่มก่อนหรือเท่ากับ toDate
            end_date: { $gte: from },  // ช่วงเวลาที่สิ้นสุดหลังหรือเท่ากับ fromDate
        });

        if (carsAvailable.length === 0) {
            return res.status(404).json({ message: "No cars available for the selected dates" });
        }

        const carIds = carsAvailable.map((car) => car.car_FK);
        const cars = await CarModel.find({ _id: { $in: carIds } });

        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found" });
        }

        const availableCars = cars.map((car) => {
            const relevantAvailability = carsAvailable.filter((availability) =>
                availability.car_FK.equals(car._id)
            );

            // คำนวณจำนวนรถที่เหลือว่างได้จริงในช่วงวันที่ต้องการ
            const minAvailableStock = Math.min(...relevantAvailability.map(a => a.stock));

            return {
                carId: car._id,
                typename: car.typename,
                numOfSeats: car.numOfSeats,
                price_per_day: car.price_per_day,
                field: car.field,
                availableStock: minAvailableStock > 0 ? minAvailableStock : 0, // ป้องกันการแสดงจำนวนรถติดลบ
                photo: car.photo
            };
        });

        res.status(200).json(availableCars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve available cars" });
    }
};






export {
    checkCarAvailable,
    addCarAvailable,
    updateCarAvailable,
    getAllCarsAvailable
};