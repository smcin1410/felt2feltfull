import mongoose from 'mongoose';

const CityDataSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        unique: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    avgMeal: {
        budget: { type: Number },
        mid: { type: Number },
        fine: { type: Number }
    },
    avgDrink: { type: Number },
    avgAirportRide: {
        taxi: { type: Number },
        rideshare: { type: Number }
    },
    dataSource: { type: String },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.CityData || mongoose.model('CityData', CityDataSchema);