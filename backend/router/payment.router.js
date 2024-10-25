import express from "express";
import { createPaymentIntent } from "../controller/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.route("/")
    .post(createPaymentIntent);
paymentRouter.route("/create-intent")
    .post(createPaymentIntent);
// paymentRouter.route("/webhook")
//     .post(express.raw({ type: 'application/json' }), handleStripeWebhook);

export default paymentRouter;