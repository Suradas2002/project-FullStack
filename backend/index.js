import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDb from "./mongodb/connect.js";
import Stripe from "stripe";

// Routers
import bookingRouter from "./router/booking.router.js";
import carRouter from "./router/car.router.js";
import customerRouter from "./router/customer.router.js";
import paymentRouter from "./router/payment.router.js";
import carAvailabilityRouter from "./router/car.available.router.js";
import loginRouter from "./router/login.router.js";
import bodyParser from "body-parser";
import { handleStripeWebhook } from "./controller/payment.controller.js";



dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send("Welcome to OurService");
});

app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/car-availability", carAvailabilityRouter);
app.use("/api/v1/login", loginRouter);

const startServer = async () => {
    try {
        connectDb(process.env.MONGODB_URL);
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
