
import Meeting from '../../entities/Meetings';
import { IMeeting } from '../../interfaces/interface';

class MeetingRepository {
    public createMeeting = async (calendarId: string, title: string, startTime: Date, endTime: Date, organizerId: string, participants: string[]): Promise<IMeeting> => {
        const newMeeting = new Meeting({ calendarId, title, startTime, endTime, organizerId, participants });
        return await newMeeting.save();
    };

    public getMeetingById = async (meetingId: string): Promise<IMeeting | null> => {
        return await Meeting.findById(meetingId).exec();
    };

    public updateMeeting = async (meetingId: string, updateData: any) => {
        try {
            // Update the meeting document
            const updatedMeeting = await Meeting.findByIdAndUpdate(
                meetingId,
                updateData,
                { new: true, runValidators: true }
            );
            return updatedMeeting;
        } catch (error) {
            console.error('Error updating meeting in repository:', error);
            throw new Error('Failed to update meeting');
        }
    };

    public deleteMeeting = async (meetingId: string): Promise<{ status: number, message: string }> => {
        const result = await Meeting.findByIdAndDelete(meetingId).exec();
        if (result) {
            return { status: 204, message: "Meeting deleted" }; // 204 No Content
        }
        return { status: 404, message: "Meeting not found" }; // 404 Not Found
    };

    public getMeetingsByCalendar = async (calendarId: string): Promise<IMeeting[]> => {
        return await Meeting.find({ calendarId }).exec();
    };

    public async findById(id: string) {
        try {
            return await Meeting.findById(id).exec();
        } catch (error) {
            console.error('Error finding meeting:', error);
            throw new Error('Error fetching meeting');
        }
    }
}

export default new MeetingRepository();
