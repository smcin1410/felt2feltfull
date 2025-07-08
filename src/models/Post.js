import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    authorRank: {
        type: String,
        default: 'New Hand'
    },
    city: { type: String },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        authorEmail: { type: String },
        text: { type: String, required: true },
        authorRank: { type: String, default: 'New Hand' },
        date: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);