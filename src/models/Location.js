import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  // Your schema fields like city, country, etc. go here
  city: String,
  country: String,
  description: String,
  image: String,
  pokerRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PokerRoom' }],
  tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }],
});

// Ensure the model name is 'Location' here
export default mongoose.models.Location || mongoose.model('Location', LocationSchema);