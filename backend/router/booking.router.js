import express from "express";
import { createBooking, cancelBooking, updateBooking } from "../controller/booking.controller.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.route("/")
    .post(createBooking);

bookingRouter.route("/:bookingId")
    .delete(authenticateToken, checkRole(['admin']), cancelBooking)
    .patch(authenticateToken, checkRole(['admin']), updateBooking);

export default bookingRouter;
