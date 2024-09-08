import {Response,Request} from 'express'
import { StatusCode } from '../../interfaces/enum'
import calendarUseCase from '../use-cases/calendarUseCases';
import meetingUseCase from '../use-cases/meetingUseCases';
import mongoose from 'mongoose';

const calendarUseCases=new calendarUseCase()

const meetingUseCases=new meetingUseCase()



export default class meetingController{
    
    createMeeting = async (req: Request, res: Response) => {
        try {
            const { calendarId, title, startTime, endTime, participants } = req.body;
            const userId = req.userId; // Get the authenticated user ID
    
            // Check if the user is the owner of the calendar
            const calendar = await calendarUseCases.getCalendarById(calendarId);
            console.log(userId,calendar?.userId.toString(),"=-=-=");
            
            if (!calendar || calendar.userId.toString() !== userId) {
                return res.status(StatusCode.Forbidden).json({ message: 'Not authorized to create a meeting in this calendar' });
            }
    
            const meeting = await meetingUseCases.createMeeting(calendarId, title, new Date(startTime), new Date(endTime), userId, participants);
            if ('status' in meeting) {
                return res.status(meeting.status).json(meeting);
            }
            res.status(StatusCode.Created).json(meeting);
        } catch (error) {
            console.error('Error creating meeting:', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };

    public async updateMeeting(req: Request, res: Response): Promise<Response> {
        try {
            const meetingId = req.params.meetingId;
            const userId = req.userId; // Extract the authenticated user's ID
            const { title, startTime, endTime, participantsToAdd, participantsToRemove } = req.body;

            // Validate meeting ID
            if (!meetingId) {
                return res.status(StatusCode.BadRequest).json({ error: 'Meeting ID is required' });
            }

            // Check if the meeting exists
            const meeting = await meetingUseCases.getMeetingById( meetingId);
            if (!meeting) {
                return res.status(StatusCode.NotFound).json({ error: 'Meeting not found' });
            }

            // Ensure the user is the organizer of the calendar
            const calendar = await calendarUseCases.getCalendarById(meeting.calendarId.toString());
            if (!calendar) {
                return res.status(StatusCode.Forbidden).json({ error: 'Not authorized to update this meeting' });
            }

            // Parse participants
            const newParticipants = Array.isArray(participantsToAdd) ? participantsToAdd : JSON.parse(participantsToAdd || "[]");
            const participantsToRemoveArray = Array.isArray(participantsToRemove) ? participantsToRemove : JSON.parse(participantsToRemove || "[]");

            // Prepare update object
            const updateData: any = { title, startTime, endTime };

            let updateResult;

            if (newParticipants.length > 0) {
                // Ensure no duplicate participants are added
                const uniqueNewParticipants = [...new Set(newParticipants)];
                updateResult = await meetingUseCases.updateMeeting(meetingId, {
                    $addToSet: { participants: { $each: uniqueNewParticipants } }
                });
            }

            if (participantsToRemoveArray.length > 0) {
                // Remove participants
                updateResult = await meetingUseCases.updateMeeting(meetingId, {
                    $pull: { participants: { $in: participantsToRemoveArray } }
                });
            }

            if (!updateResult) {
                return res.status(StatusCode.BadRequest).json({ message: 'No valid update fields provided or update failed' });
            }

            return res.status(StatusCode.OK).json({ message: 'Meeting updated successfully' });
        } catch (error) {
            console.error('Error updating meeting:', error);
            return res.status(StatusCode.InternalServerError).json({ error: 'Error updating meeting' });
        }
    }

    public async deleteMeeting(req: Request, res: Response): Promise<Response> {
        try {
            const meetingId = req.params.meetingId;
            const userId = req.userId; // Extract the authenticated user's ID

            // Validate meeting ID
            if (!meetingId) {
                return res.status(StatusCode.BadRequest).json({ error: 'Meeting ID is required' });
            }

            // Check if the meeting exists
            const meeting = await meetingUseCases.getMeetingById(meetingId);
            if (!meeting) {
                return res.status(StatusCode.NotFound).json({ message: 'Meeting not found' });
            }

            // Ensure the user is the organizer of the calendar
            const calendar = await calendarUseCases.getCalendarById(meeting.calendarId.toString());
            if (!calendar) {
                return res.status(StatusCode.Forbidden).json({ error: 'Not authorized to delete this meeting' });
            }

            // Call the use case to delete the meeting
            const result = await meetingUseCases.deleteMeeting(meetingId);

            if (!result) {
                return res.status(StatusCode.NotFound).json({ message: 'Meeting not found' });
            }

            return res.status(StatusCode.OK).json({ message: 'Meeting deleted successfully' });
        } catch (error) {
            console.error('Error deleting meeting:', error);
            return res.status(StatusCode.InternalServerError).json({ error: 'Error deleting meeting' });
        }
    }

    public async getAllMeetingsByCalendar(req: Request, res: Response): Promise<Response> {
        try {
            const calendarId = req.params.calendarId;
            const userId = req.userId; // Extract the authenticated user's ID

            // Validate calendar ID
            if (!calendarId) {
                return res.status(StatusCode.BadRequest).json({ error: 'Calendar ID is required' });
            }

            // Ensure the user is authorized to view the calendar
            const calendar = await calendarUseCases.getCalendarById( calendarId);
            if (!calendar) {
                return res.status(StatusCode.Forbidden).json({ error: 'Not authorized to view this calendar' });
            }

            // Call the use case to get meetings
            const meetings = await meetingUseCases.getMeetingsByCalendar(calendarId);

            if (!meetings || meetings.length === 0) {
                return res.status(StatusCode.NotFound).json({ message: 'No meetings found for this calendar' });
            }

            return res.status(StatusCode.OK).json(meetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            return res.status(StatusCode.InternalServerError).json({ error: 'Error fetching meetings' });
        }
    }


    getMeetingById=async(req: Request, res: Response): Promise<Response>=> {
        const { meetingId } = req.params;
        const userId = req.userId; // Extract the authenticated user's ID

        try {
            // Fetch the meeting details
            const meeting = await meetingUseCases.getMeetingByMeetingId(meetingId);
            if (!meeting) {
                return res.status(404).json({ message: 'Meeting not found' });
            }

            // Check if the user is the owner of the calendar to which the meeting belongs
            const calendar = await calendarUseCases.getCalendarByCalenderId(meeting.calendarId.toString());
            console.log(calendar.userId.toString() ,userId);
            
            if (!calendar || calendar.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized to view this meeting' });
            }
            return res.status(200).json(meeting);
        } catch (error) {
            console.error('Error fetching meeting:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    
    
}