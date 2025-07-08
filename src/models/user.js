import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Changed to ES Module import

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'user'
    },
    points: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: 'New Hand'
    }
});

// Before saving, check if it's the first user to make them an admin
UserSchema.pre('save', async function(next) {
    if (this.isNew) {
        const userCount = await this.constructor.countDocuments();
        if (userCount === 0) {
            this.role = 'admin';
        }
    }
    next();
});

export default mongoose.models.user || mongoose.model('user', UserSchema);