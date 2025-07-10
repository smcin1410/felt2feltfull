import mongoose, { Schema } from 'mongoose';

const InvitationSchema = new Schema({
    itineraryId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Itinerary', 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['editor', 'viewer'], 
        required: true 
    },
    token: { 
        type: String, 
        required: true, 
        unique: true 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'expired'],
        default: 'pending'
    }
}, { timestamps: true });

// Index for automatic cleanup of expired invitations
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);