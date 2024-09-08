// src/controllers/EventController.ts
import { Request, Response } from 'express';
import EventUseCases from '../use-cases/eventUseCases';
import mongoose from 'mongoose';
import { StatusCode } from '../../interfaces/enum';
import calendarUseCase from '../use-cases/calendarUseCases';

const CalendarUseCases=new calendarUseCase()

class EventController {
  // Create Event
  async createEvent(req: Request, res: Response) {
    try {
      const userId = req.userId; 
      const { calendarId, title, description, location, startTime, endTime } = req.body;


      const calendar = await CalendarUseCases.getCalendarById(calendarId);

      if (!calendar || calendar.userId.toString() !== userId) {
        return res.status(StatusCode.Forbidden).json({ message: 'Not authorized to create an event in this calendar' });
      }


      const event = await EventUseCases.createEvent({
        calendarId: new mongoose.Types.ObjectId(calendarId),
        title,
        description,
        organizerId: new mongoose.Types.ObjectId(userId), 
        location,
        startTime,
        endTime,
      });

      if (!event) throw new Error('Event creation failed');
      res.status(StatusCode.Created).json(event);
    } catch (error:any) {
      res.status(StatusCode.InternalServerError).json({ error: error.message || 'Failed to create event' });
    }
  }

  // Update Event
  async updateEvent(req: Request, res: Response) {
    try {
      const userId = req.userId; 
      const eventId = req.params.eventId;
      const { title, description, location, startTime, endTime } = req.body;


      const event = await EventUseCases.getEventById(new mongoose.Types.ObjectId(eventId));

      if (!event) {
        return res.status(StatusCode.NotFound).json({ message: 'Event not found' });
      }


      if (event.organizerId.toString() !== userId) {
        return res.status(StatusCode.Forbidden).json({ message: 'Not authorized to update this event' });
      }


      const updatedEvent = await EventUseCases.updateEvent(new mongoose.Types.ObjectId(eventId), {
        title,
        description,
        location,
        startTime,
        endTime,
      });

      if (!updatedEvent) throw new Error('Event update failed');
      res.status(StatusCode.OK).json(updatedEvent);
    } catch (error:any) {
      res.status(StatusCode.InternalServerError).json({ error: error.message || 'Failed to update event' });
    }
  }

  // Delete Event
  async deleteEvent(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const eventId = req.params.eventId;

      // Check if the event exists
      const event = await EventUseCases.getEventById(new mongoose.Types.ObjectId(eventId));

      if (!event) {
        return res.status(StatusCode.NotFound).json({ message: 'Event not found' });
      }

      // Check if the user is the organizer of the event
      if (event.organizerId.toString() !== userId) {
        return res.status(StatusCode.Forbidden).json({ message: 'Not authorized to delete this event' });
      }

      // Delete event
      const result = await EventUseCases.deleteEvent(new mongoose.Types.ObjectId(eventId));

      if (!result) throw new Error('Event deletion failed');
      res.status(StatusCode.OK).json({ message: 'Event deleted successfully' });
    } catch (error:any) {
      res.status(StatusCode.InternalServerError).json({ error: error.message || 'Failed to delete event' });
    }
  }

  // Get Event by Calendar
  async getEventsByCalendar(req: Request, res: Response) {
        try {
        const calendarId = req.params.calendarId;

        // Check if the calendar exists
        const calendar = await CalendarUseCases.getCalendarById(calendarId);

        if (!calendar) {
            return res.status(StatusCode.NotFound).json({ message: 'Calendar not found' });
        }

        // Get all events for the calendar
        const events = await EventUseCases.getAllEventsByCalendar(new mongoose.Types.ObjectId(calendarId));

        if (!events || events.length === 0) {
            return res.status(StatusCode.NotFound).json({ message: 'No events found for this calendar' });
        }

        res.status(StatusCode.OK).json(events);
        } catch (error:any) {
        res.status(StatusCode.InternalServerError).json({ error: error.message || 'Failed to fetch events' });
        }
    }

    getEventById=async(req: Request, res: Response): Promise<Response>=> {
        const { eventId } = req.params;
        const userId = req.userId; // Extract the authenticated user's ID

        try {
            // Fetch the event details
            const event = await EventUseCases.getEventById(new mongoose.Types.ObjectId(eventId));
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            // Check if the user is the owner of the calendar to which the event belongs
            const calendar = await CalendarUseCases.getCalendarByCalenderId(event.calendarId.toString());
            if (!calendar || calendar.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized to view this event' });
            }

            return res.status(200).json(event);
        } catch (error) {
            console.error('Error fetching event:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }


}

export default new EventController();
