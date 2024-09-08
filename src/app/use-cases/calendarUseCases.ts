import { StatusCode } from "../../interfaces/enum";
import { ICalendar } from "../../interfaces/interface";
import CalenderRepository from "../repository/calenderRepository";

const calendarRepo=new CalenderRepository()

export default class calendarUseCases {
    createCalendar = async (name: string, date: Date, userId: string): Promise<ICalendar | { status: number, message: string }> => {
        try {
            // Create a new calendar
            const newCalendar = await calendarRepo.createCalendar({ name, date, userId });
            return newCalendar;
        } catch (error) {
            console.error("Error creating calendar:", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    };

    updateCalendarName = async (calendarId: string, name: string): Promise<ICalendar | { status: number, message: string }> => {
        try {
            const updatedCalendar = await calendarRepo.updateCalendarName(calendarId, name);
            
            if (!updatedCalendar) {
                return { status: StatusCode.NotFound as number, message: "Calendar not found" };
            }

            return updatedCalendar;
        } catch (error) {
            console.error("Error updating calendar name:", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    };

    deleteCalendar = async (calendarId: string): Promise<{ status: number, message: string }> => {
        try {
            const result = await calendarRepo.deleteCalendar(calendarId);

            if (!result) {
                return { status: StatusCode.NotFound as number, message: "Calendar not found" };
            }

            return { status: StatusCode.OK as number, message: "Calendar deleted successfully" };
        } catch (error) {
            console.error("Error deleting calendar:", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    };

    getUserCalendars = async (userId: string): Promise<ICalendar[] | { status: number, message: string }> => {
        try {
            // Fetch all calendars for the user
            const calendars = await calendarRepo.findCalendarsByUserId(userId);
            return calendars;
        } catch (error) {
            console.error('Error getting user calendars:', error);
            return { status: StatusCode.InternalServerError as number, message: 'Internal Server Error' };
        }
    };
    getCalendarById = async (calendarId: string): Promise<ICalendar | null> => {
        try {
            return await calendarRepo.findById(calendarId);
        } catch (error) {
            console.error('Error finding calendar by ID:', error);
            return null;
        }
    };

    getCalendarByCalenderId=async(calendarId: string)=>{
        const calendar = await calendarRepo.findById(calendarId);
        if (!calendar) {
            throw new Error('Calendar not found');
        }
        return calendar;
    }

    
}