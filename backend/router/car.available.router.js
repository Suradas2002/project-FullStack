import express from "express";

import { authenticateToken, checkRole } from "../middleware/auth.js";
import { addCarAvailable, checkCarAvailable, getAllCarsAvailable } from "../controller/car.available.controller.js";



const carAvailabilityRouter = express.Router();

carAvailabilityRouter.route("/")
    .get(getAllCarsAvailable)
    .post(checkCarAvailable);

carAvailabilityRouter.route("/add")
    .post(authenticateToken, checkRole(['admin']), addCarAvailable)

export default carAvailabilityRouter;