// src/use-cases/EventUseCases.ts
import { IEvent } from '../../entities/Events';
import EventRepository from '../repository/eventRepository';
import mongoose from 'mongoose';

class EventUseCases {
  async createEvent(data: Partial<IEvent>) {
    try {
      return await EventRepository.createEvent(data);
    } catch (error) {
      throw new Error('Error creating event');
    }
  }

  async getEventById(eventId: mongoose.Types.ObjectId) {
    try {
      return await EventRepository.findEventById(eventId);
    } catch (error) {
      throw new Error('Error fetching event');
    }
  }

  async updateEvent(eventId: mongoose.Types.ObjectId, data: Partial<IEvent>) {
    try {
      return await EventRepository.updateEvent(eventId, data);
    } catch (error) {
      throw new Error('Error updating event');
    }
  }

  async deleteEvent(eventId: mongoose.Types.ObjectId) {
    try {
      return await EventRepository.deleteEvent(eventId);
    } catch (error) {
      throw new Error('Error deleting event');
    }
  }

  async getAllEventsByCalendar(calendarId: mongoose.Types.ObjectId) {
    try {
      return await EventRepository.getAllEventsByCalendar(calendarId);
    } catch (error) {
      throw new Error('Error fetching events');
    }
  }

  
}

export default new EventUseCases();
