import { Router } from 'express';
import {
    getAllSchedules,
    getSchedulesByDeviceName,
    setSchedule,
    deleteSchedule,
} from '../controller/schedule.controller.js';

const route = Router();

route.get('/schedules', getAllSchedules);

route.get('/schedules/device/:deviceName', getSchedulesByDeviceName);

route.post('/schedule', setSchedule);

route.delete('/schedule/:scheduleId', deleteSchedule);

export const ScheduleRoute = route;
