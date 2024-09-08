import {Response,Request} from 'express'
import { StatusCode } from '../../interfaces/enum'
import calendarUseCase from '../use-cases/calendarUseCases';

const calendarUseCases=new calendarUseCase()




export default class calendarController{

    createCalendar = async (req: Request, res: Response) => {
        try {
            const { name, userId } = req.body;
            // Validate the inputs
            if (!name  || !userId) {
                return res.status(StatusCode.BadRequest).json({ message: 'Missing required fields' });
            }
    
            const createResponse = await calendarUseCases.createCalendar(name, new Date, userId);
    
            if ('status' in createResponse) {
                res.status(createResponse.status).json(createResponse);
            } else {
                res.status(StatusCode.Created).json(createResponse);
            }
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };

    updateCalendarName = async (req: Request, res: Response) => {
        try {
            const { calendarId } = req.params;
            const { name } = req.body;
    
            if (!name) {
                return res.status(StatusCode.BadRequest).json({ message: 'Name is required' });
            }
    
            const updateResponse = await calendarUseCases.updateCalendarName(calendarId, name);
    
            if ('status' in updateResponse) {
                res.status(updateResponse.status).json(updateResponse);
            } else {
                res.status(StatusCode.OK).json(updateResponse);
            }
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };

    deleteCalendar = async (req: Request, res: Response) => {
        try {
            const { calendarId } = req.params;
            console.log(calendarId);
            
            const deleteResponse = await calendarUseCases.deleteCalendar(calendarId);
    
            if ('status' in deleteResponse) {
                res.status(deleteResponse.status).json(deleteResponse);
            } else {
                res.status(StatusCode.OK).json(deleteResponse);
            }
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };

    getUserCalendars = async (req: Request, res: Response) => {
        try {
            const userId:string = req.userId as string; // Get the userId from the request, set by the JWT middleware
            const calendars = await calendarUseCases.getUserCalendars(userId);
    
            if (!calendars) {
                return res.status(StatusCode.NotFound).json({ message: 'No calendars found' });
            }
    
            res.status(StatusCode.OK).json(calendars);
        } catch (error) {
            console.error('Error fetching user calendars:', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };

    getCalendarById=async(req: Request, res: Response): Promise<Response> =>{
        const { calendarId } = req.params;
        const userId = req.userId; // Extract the authenticated user's ID

        try {
            // Fetch the calendar details
            const calendar = await calendarUseCases.getCalendarByCalenderId(calendarId);
            if (!calendar) {
                return res.status(404).json({ message: 'Calendar not found' });
            }

            // Check if the user is the owner of the calendar
            if (calendar.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized to view this calendar' });
            }

            return res.status(200).json(calendar);
        } catch (error) {
            console.error('Error fetching calendar:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    
}