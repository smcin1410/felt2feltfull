import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    // ... your EventSchema fields are perfect ...
    eventNumber: { type: String, trim: true },
    eventName: { type: String, required: [true, 'Event name is required.'], trim: true },
    date: { type: String, trim: true },
    buyin: { type: String, trim: true },
    guarantee: { type: String, trim: true },
    gameType: { type: String, trim: true, default: 'No Limit Hold\'em' },
    notes: { type: String, trim: true }
});

const TournamentSchema = new mongoose.Schema({
    // ... your TournamentSchema fields are perfect, including the ref to 'Location' ...
    seriesName: { type: String, required: [true, 'Series name is required.'], trim: true, unique: true },
    majorCircuit: { type: String, trim: true, enum: ['WSOP', 'WPT', 'EPT', 'PGT', 'MSPT', 'Independent'] },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    city: { type: String, required: [true, 'City is required.'], trim: true },
    region: { type: String, required: [true, 'Region/State is required.'], trim: true },
    country: { type: String, required: [true, 'Country is required.'], trim: true },
    startDate: { type: Date, required: [true, 'Start date is required.'] },
    endDate: { type: Date, required: [true, 'End date is required.'] },
    status: { type: String, enum: ['Upcoming', 'Active', 'Completed'], default: 'Upcoming' },
    officialSite: { type: String, trim: true },
    tags: [String],
    schedule: [EventSchema]
}, {
    timestamps: true
});

TournamentSchema.pre('save', function(next) {
    const now = new Date();
    if (this.endDate < now) {
        this.status = 'Completed';
    } else if (this.startDate <= now && this.endDate >= now) {
        this.status = 'Active';
    } else {
        this.status = 'Upcoming';
    }
    next();
});

// This is the updated export line
export default mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);