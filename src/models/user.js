import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        select: false // Prevents password from being returned in queries
    },
    name: {
        type: String
    },
    authProvider: {
        type: String,
        default: 'credentials' // e.g., 'google', 'credentials'
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
}, { timestamps: true });

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

export default mongoose.models.User || mongoose.model('User', UserSchema);