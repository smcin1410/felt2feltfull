import mongoose from 'mongoose';

const PokerRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Poker room name is required.'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    // This links the poker room back to a specific location
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    // You can add more fields here later (e.g., hours, games offered, etc.)
}, {
    timestamps: true
});

export default mongoose.models.PokerRoom || mongoose.model('PokerRoom', PokerRoomSchema);