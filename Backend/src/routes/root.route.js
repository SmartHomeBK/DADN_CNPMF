import { Router } from 'express';
import { EnvRouter } from './env.route.js';
import { AuthRouter } from './auth.route.js';
import { DeviceRoute } from './device.route.js';
import { SensorRoute } from './sensor.route.js';
import { isUserAuthenticated } from '../middleWares/verifyTokenByBearer.middleware.js';
import { ScheduleRoute } from './schedule.route.js';
import { HistoryRoute } from './history.route.js';

const root = Router();
root.use('/api/auth', AuthRouter);
root.use(isUserAuthenticated);
root.use('/api/env', EnvRouter);
root.use('/api/devices', DeviceRoute);
root.use('/api/sensors', SensorRoute);
root.use('/api/schedules', ScheduleRoute);
root.use('/api/history', HistoryRoute);
export default root;
