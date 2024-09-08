import mongoose from "mongoose";
import { ICalendar } from "../../interfaces/interface";
import Calendar from "../../entities/calender";


export default class CalenderRepository{
    createCalendar = async ({name,date,userId}:{name:string,date:Date,userId:string}): Promise<ICalendar> => {
        try {
            const newCalendar = new Calendar({name,date,userId});
            return await newCalendar.save();
        } catch (error) {
            console.error("Error saving calendar:", error);
            throw new Error("Database error");
        }
    }


    updateCalendarName = async (calendarId: string, name: string): Promise<ICalendar | null> => {
        try {
            return await Calendar.findByIdAndUpdate(
                calendarId,
                { name },
                { new: true } // Return the updated document
            ).exec();
        } catch (error) {
            console.error("Error updating calendar name:", error);
            throw new Error("Internal Server Error");
        }
    };

    // New deleteCalendar method with error handling
    deleteCalendar = async (calendarId: string): Promise<ICalendar | null> => {
        try {
            return await Calendar.findByIdAndDelete(calendarId).exec();
        } catch (error) {
            console.error("Error deleting calendar:", error);
            throw new Error("Internal Server Error");
        }
    };

    public findCalendarsByUserId = async (userId: string): Promise<ICalendar[]> => {
        try {
            // Fetch calendars from the database where userId matches
            const calendars = await Calendar.find({ userId }).exec();
            return calendars;
        } catch (error) {
            console.error('Error finding calendars by user ID:', error);
            throw new Error('Failed to find calendars');
        }
    };

    public findById = async (calendarId: string): Promise<ICalendar | null> => {
        try {
            return await Calendar.findById(calendarId).exec();
        } catch (error) {
            console.error('Error finding calendar by ID:', error);
            return null;
        }
    };


}
