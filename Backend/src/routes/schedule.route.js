import { Router } from 'express';
import {
    getAllSchedules,
    getSchedulesByDeviceName,
    setSchedule,
    deleteSchedule,
} from '../controller/schedule.controller.js';

const route = Router();

route.get('/', getAllSchedules);

route.get('/device/:deviceName', getSchedulesByDeviceName);

route.post('/', setSchedule);

route.delete('/:scheduleId', deleteSchedule);

export const ScheduleRoute = route;
