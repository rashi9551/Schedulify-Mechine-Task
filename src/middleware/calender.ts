import { Request, Response, NextFunction } from 'express';
import { StatusCode } from "../interfaces/enum";
import Calendar from '../entities/calender';

// Middleware to check if the authenticated user is the owner of the calendar
const isCalendarOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { calendarId } = req.params;
    const userId = req.userId; // Assume userId is set by the authentication middleware

    if (!userId) {
        return res.status(StatusCode.Unauthorized).json({ message: "User not authenticated" });
    }

    try {
        const calendar = await Calendar.findById(calendarId).exec();

        if (!calendar) {
            return res.status(StatusCode.NotFound).json({ message: "Calendar not found" });
        }

        if (calendar.userId.toString() !== userId) {
            return res.status(StatusCode.Forbidden).json({ message: "Not authorized to update this calendar" });
        }

        next();
    } catch (error) {
        console.error("Error checking calendar ownership:", error);
        res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
    }
};

export default isCalendarOwner;
