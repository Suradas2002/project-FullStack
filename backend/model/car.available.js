import mongoose from "mongoose";


const CarAvailableSchema = new mongoose.Schema({
    car_FK: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    stock: { type: Number, },
    available: { type: Boolean, default: true },
});

const CarAvailableModel = mongoose.model('CarAvailable', CarAvailableSchema);

export default CarAvailableModel