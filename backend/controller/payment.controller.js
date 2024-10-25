// import BookingModel from "../model/booking.js";
// import Stripe from "stripe";
// import updateCarAvailable from "../model/car.available.js";
// import * as dotenv from "dotenv";

// dotenv.config(); // โหลดตัวแปรจากไฟล์ .env

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ใช้ Secret Key จากตัวแปร Environment

// const createPaymentIntent = async (req, res) => {
//     try {
//         const { bookingId } = req.body;
//         console.log("Received bookingId:", bookingId);

//         const booking = await BookingModel.findById(bookingId);
//         if (!booking) {
//             return res.status(404).json({ error: 'Booking not found' });
//         }

//         const amount = booking.amount;

//         // สร้าง Payment Intent
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100, // แปลงเป็นสกุลเงินที่เป็นเซนต์
//             currency: 'thb',
//             metadata: { bookingId: booking._id.toString() },
//         });

//         // ส่ง clientSecret กลับไปให้ frontend
//         res.status(201).json({
//             clientSecret: paymentIntent.client_secret,
//         });
//     } catch (error) {
//         console.error('Error creating payment intent:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// const handleStripeWebhook = async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         // ตรวจสอบลายเซ็นโดยใช้ payload ดิบ
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); // เปลี่ยนเป็น Secret ของคุณ
//     } catch (err) {
//         console.error(`Webhook signature verification failed: ${err.message}`);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     console.log(event.type);

//     // ตรวจสอบประเภทของเหตุการณ์
//     if (event.type === 'payment_intent.succeeded') {
//         const paymentIntent = event.data.object;
//         const bookingId = paymentIntent.metadata.bookingId;

//         // ค้นหาการจองที่เกี่ยวข้อง
//         const booking = await BookingModel.findById(bookingId);

//         if (booking) {
//             // อัปเดตสถานะการจองและสต็อกของรถ
//             await updateCarAvailable(booking.carId, booking.startDate, booking.endDate, booking.stock, false);
//         }
//     }

//     res.status(200).send('Received');
// };

// export { createPaymentIntent, handleStripeWebhook };
import BookingModel from "../model/booking.js";
import Stripe from "stripe";
import { updateCarAvailable } from "./car.available.controller.js";
import * as dotenv from "dotenv";
dotenv.config(); // โหลดตัวแปรจากไฟล์ .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ใช้ Secret Key จากตัวแปร Environment

const createPaymentIntent = async (req, res) => {
    try {
        const { bookingId } = req.body;
        console.log("Received bookingId:", bookingId);

        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            console.error(`Booking not found for ID: ${bookingId}`);
            return res.status(404).json({ error: 'Booking not found' });
        }

        const amount = booking.amount;


        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // แปลงเป็นสกุลเงินที่เป็นเซนต์
            currency: 'thb',
            metadata: { bookingId: booking._id.toString() },
        });

        // ส่ง clientSecret กลับไปให้ frontend
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};

const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    switch (event.type) {
        case "payment_intent.succeeded":
            console.log('PaymentIntent was successful!', event.data.object);
            const paymentIntent = event.data.object;
            const bookingId = paymentIntent.metadata.bookingId;


            const booking = await BookingModel.findById(bookingId).populate('cars.carId');

            if (booking) {



                for (const car of booking.cars) {
                    const carId = car.carId._id;
                    const startDate = booking.fromDate;
                    const endDate = booking.toDate;
                    const stock = car.stock;


                    await updateCarAvailable(carId, startDate, endDate, stock, false);
                    console.log(`Updated car availability for car ID: ${carId}`);
                }
            } else {
                console.error(`Booking not found for ID: ${bookingId}`);
            }
            break;

        case "charge.updated":

            break;


        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
};



export { createPaymentIntent, handleStripeWebhook };

