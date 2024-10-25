import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
    typename: { type: String, required: true },
    numOfSeats: { type: Number, required: true },
    price_per_day: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    field: { type: String, required: true },
    photo: { type: String, required: true },
});

const CarModel = mongoose.model('Car', CarSchema);

export default CarModel