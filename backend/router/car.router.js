import express from "express";
import { createCar, updateCar, deleteCar, getCars, getCarById } from "../controller/car.controller.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";
import multer from "multer"

const multer1 = multer()

const carRouter = express.Router();

carRouter.route("/")
    .get(getCars)
    .post(authenticateToken, checkRole(['admin']), multer1.array('photo'), createCar);

carRouter.route("/:carId")
    .get(getCarById)
    .patch(authenticateToken, checkRole(['admin']), multer1.array('photo'), updateCar)
    .delete(authenticateToken, checkRole(['admin']), deleteCar);
export default carRouter;
