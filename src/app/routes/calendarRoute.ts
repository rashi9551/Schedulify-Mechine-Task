import express, { Router, Request, Response } from 'express';
import calendarControllers from '../controllers/calendarController';
import JwtControllers from '../../services/jwt';
import isCalendarOwner from '../../middleware/calender';
import meetingControllers from '../controllers/meetingController';
import EventController from '../controllers/eventController';

const calendarController=new calendarControllers()
const meetingController=new meetingControllers()
const jwtController=new JwtControllers()

const calendarRouter: Router = express.Router();

calendarRouter.post('/addCalendar', jwtController.isAuthenticated,calendarController.createCalendar);
calendarRouter.put('/updateCalendar/:calendarId',jwtController.isAuthenticated, isCalendarOwner,calendarController.updateCalendarName);
calendarRouter.delete('/deleteCalendar/:calendarId',jwtController.isAuthenticated, calendarController.deleteCalendar);
calendarRouter.get('/userCalendars', jwtController.isAuthenticated, calendarController.getUserCalendars);
calendarRouter.get('/getCalendarsById/:calendarId', jwtController.isAuthenticated, calendarController.getCalendarById);


// Routes for meetings
calendarRouter.post('/addMeeting', jwtController.isAuthenticated,meetingController.createMeeting);
calendarRouter.put('/updateMeeting/:meetingId',jwtController.isAuthenticated, meetingController.updateMeeting);
calendarRouter.delete('/deleteMeeting/:meetingId', jwtController.isAuthenticated,meetingController.deleteMeeting);
calendarRouter.get('/getMeetings/:calendarId',jwtController.isAuthenticated, meetingController.getAllMeetingsByCalendar);
calendarRouter.get('/getMeetingsById/:meetingId',jwtController.isAuthenticated, meetingController.getMeetingById);


calendarRouter.post('/addEvents', jwtController.isAuthenticated, EventController.createEvent);
calendarRouter.put('/updateEvents/:eventId', jwtController.isAuthenticated, EventController.updateEvent);
calendarRouter.delete('/deleteEvents/:eventId', jwtController.isAuthenticated, EventController.deleteEvent);
calendarRouter.get('/getEvents/:calendarId', jwtController.isAuthenticated,EventController.getEventsByCalendar);
calendarRouter.get('/getEventsById/:eventId', jwtController.isAuthenticated,EventController.getEventById);


export default calendarRouter;