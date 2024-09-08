// src/repositories/EventRepository.ts
import Event, { IEvent } from '../../entities/Events';
import mongoose from 'mongoose';

class EventRepository {
  // Create a new event
  async createEvent(data: Partial<IEvent>): Promise<IEvent | null> {
    try {
      const event = new Event(data);
      return await event.save();
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  }

  // Find event by ID
  async findEventById(eventId: mongoose.Types.ObjectId): Promise<IEvent | null> {
    try {
      return await Event.findById(eventId).exec();
    } catch (error) {
      console.error("Error finding event by ID:", error);
      return null;
    }
  }

  // Update event details
  async updateEvent(eventId: mongoose.Types.ObjectId, data: Partial<IEvent>): Promise<IEvent | null> {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(eventId, data, { new: true }).exec();
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      return null;
    }
  }

  // Delete an event
  async deleteEvent(eventId: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const event = await Event.findByIdAndDelete(eventId).exec();
      return !!event;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  }

  // Get all events by calendarId
  async getAllEventsByCalendar(calendarId: mongoose.Types.ObjectId): Promise<IEvent[] | null> {
    try {
      return await Event.find({ calendarId }).exec();
    } catch (error) {
      console.error("Error fetching events by calendar ID:", error);
      return null;
    }
  }

  public async findById(id: string) {
    try {
        return await Event.findById(id).exec();
    } catch (error) {
        console.error('Error finding event:', error);
        throw new Error('Error fetching event');
    }
}
}

export default new EventRepository();
