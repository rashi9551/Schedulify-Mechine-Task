import mongoose,{ Types } from 'mongoose';

export interface UserInterface{
    userName: string;
    email: string;
    password: string;
    otp:string
}
export interface UserData{
    _id:Types.ObjectId
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
}
export interface LoginResponse{
    data:Data
}
export interface Data{
    user:UserData
    refreshToken:string
    accessToken:string
}


export interface StatusMessage{
    status: number; 
    message: string ;

}

export interface DecodedToken {
    userId: string;
    id: string;

}


export interface ICalendar extends Document {
    _id:mongoose.Types.ObjectId
    name: string;                            // Name of the calendar
    date: Date;                              // Date or creation timestamp
    userId: mongoose.Types.ObjectId;         // Reference to the user who created the calendar
    meetings: mongoose.Types.ObjectId[];     // Reference to the meetings associated with this calendar
    events: mongoose.Types.ObjectId[];       // Reference to the events associated with this calendar
  }

  export interface IMeeting extends Document {
    calendarId: mongoose.Types.ObjectId;  // Reference to the calendar this event belongs to
    title: string;
    startTime: Date;
    endTime: Date;
    organizerId: mongoose.Types.ObjectId;  // The creator of the meeting
    participants: mongoose.Types.ObjectId[]; // Other users involved in the meeting
  }
  