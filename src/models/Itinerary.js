import mongoose, { Schema, Document } from 'mongoose';

const ItinerarySchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'My Poker Trip'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['editor', 'viewer'],
            default: 'viewer'
        }
    }],
    items: [{
        id: String,
        name: String,
        type: String, // 'destination', 'tournament', etc.
        location: String,
        city: String,
        dates: String,
        buyin: Number,
        priority: String,
        dateAdded: {
            type: Date,
            default: Date.now
        }
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Keep the old ItineraryItem schema for backward compatibility
const ItineraryItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemType: {
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

export const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);
export default mongoose.models.ItineraryItem || mongoose.model('ItineraryItem', ItineraryItemSchema);