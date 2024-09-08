import mongoose, { Schema, Document } from 'mongoose';
import { ICalendar } from '../interfaces/interface';



const CalendarSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,   // Automatically set to the current date/time
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',         // Reference to the User who owns the calendar
    required: true,
  }
}, {
  timestamps: true,      // Automatically adds createdAt and updatedAt fields
});

const Calendar = mongoose.model<ICalendar>('Calendar', CalendarSchema);
export default Calendar;
