import mongoose from 'mongoose';

const ItineraryItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // This links the item to a specific user
        required: true
    },
    itemType: { // e.g., 'room', 'tournament'
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: { type: String },
    city: { type: String },
    dates: { type: String },
    buyin: { type: Number },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.ItineraryItem || mongoose.model('ItineraryItem', ItineraryItemSchema);