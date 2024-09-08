import { IMeeting } from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import meetingRepository from '../repository/meetingRepository';
import calendarUseCases from './calendarUseCases';

export default class MeetingUseCases {
    public createMeeting = async (calendarId: string, title: string, startTime: Date, endTime: Date, organizerId: string, participants: string[]): Promise<IMeeting | { status: number, message: string }> => {
        try {
            const newMeeting = await meetingRepository.createMeeting(calendarId, title, startTime, endTime, organizerId, participants);
            return newMeeting;
        } catch (error) {
            console.error('Error creating meeting:', error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    };

    public getMeetingById = async (meetingId: string): Promise<IMeeting | null> => {
        try {
            return await meetingRepository.getMeetingById(meetingId);
        } catch (error) {
            console.error('Error fetching meeting:', error);
            return null;
        }
    };

    public updateMeeting = async (meetingId: string, updateData: any) => {
        try {
            // Find and update the meeting with new data
            const updatedMeeting = await meetingRepository.updateMeeting(meetingId, updateData);
            return updatedMeeting;
        } catch (error) {
            console.error('Error updating meeting in use case:', error);
            throw new Error('Failed to update meeting');
        }
    };

    public deleteMeeting = async (meetingId: string): Promise<{ status: number, message: string }> => {
        try {
            const result = await meetingRepository.deleteMeeting(meetingId);
            return result || { status: StatusCode.NotFound as number, message: "Meeting not found" };
        } catch (error) {
            console.error('Error deleting meeting:', error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    };

    public getMeetingsByCalendar = async (calendarId: string): Promise<IMeeting[]> => {
        try {
            return await meetingRepository.getMeetingsByCalendar(calendarId);
        } catch (error) {
            console.error('Error fetching meetings by calendar:', error);
            return [];
        }
    };

    public getMeetingByMeetingId=async(meetingId: string)=> {
        const meeting = await meetingRepository.findById(meetingId);
        if (!meeting) {
            throw new Error('Meeting not found');
        }
        return meeting;
    }

   
}

