import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    customer_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    cars: [{
        carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
        get_car_address: { type: String },
        stock: { type: Number, required: true }
    }],
    payment_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    description: { type: String },
    amount: { type: Number, required: true },
    numberOfCars: { type: Number, required: true }
});

const BookingModel = mongoose.model('Booking', BookingSchema);

export default BookingModel;
