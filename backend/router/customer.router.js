import express from "express";
import { getAllCustomers, createCustomer } from "../controller/customer.controller.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";

const customerRouter = express.Router();

customerRouter.route("/")
    .get(getAllCustomers)
    .post(createCustomer);

export default customerRouter;
