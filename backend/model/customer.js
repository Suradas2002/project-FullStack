import mongoose from "mongoose";


const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    username: { type: String, },
    password: { type: String, },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
});
const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

export default CustomerModel