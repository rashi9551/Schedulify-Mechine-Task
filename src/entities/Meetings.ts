import mongoose, { Schema, Document } from 'mongoose';
import { IMeeting } from '../interfaces/interface';


const MeetingSchema: Schema = new Schema({
   calendarId: {
        type: Schema.Types.ObjectId,
        ref: 'Calendar', // Reference to the Calendar model
        required: true,
    },
  title: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  organizerId: {  // Meeting creator
    type: Schema.Types.ObjectId,
    ref: 'User',  // Referencing the User model
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Participants are other users in the system
      required: false,
    },
  ],
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

const Meeting = mongoose.model<IMeeting>('Meeting', MeetingSchema);
export default Meeting;
