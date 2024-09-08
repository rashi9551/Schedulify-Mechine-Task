import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  calendarId: mongoose.Types.ObjectId;  // Reference to the calendar this event belongs to
  title: string;                        // Title of the event
  description?: string;                 // Optional description of the event
  organizerId: mongoose.Types.ObjectId; // User who created the event (organizer)
  participants: mongoose.Types.ObjectId[]; // Array of user IDs attending the event
  location?: string;                    // Location of the event (optional)
  startTime: Date;                      // Start time of the event
  endTime: Date;                        // End time of the event
  createdAt: Date;                      // Creation timestamp
  updatedAt: Date;                      // Last update timestamp
}

const EventSchema: Schema = new Schema({
  calendarId: {
    type: Schema.Types.ObjectId,
    ref: 'Calendar', // Reference to the Calendar model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (event creator)
    required: true,
  },
  location: {
    type: String,
    default: null,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Event = mongoose.model<IEvent>('Event', EventSchema);
export default Event;
