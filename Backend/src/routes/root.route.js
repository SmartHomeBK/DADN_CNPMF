import { Router } from 'express';
import { EnvRouter } from './env.route.js';
import { AuthRouter } from './auth.route.js';
import { DeviceRoute } from './device.route.js';
import { SensorRoute } from './sensor.route.js';
import { isUserAuthenticated } from '../middleWares/verifyTokenByBearer.middleware.js';

const root = Router();
root.use('/api/auth', AuthRouter);
root.use(isUserAuthenticated);
root.use('/api/env', EnvRouter);
root.use('/api/devices', DeviceRoute);
root.use('/api/sensors', SensorRoute); // This line is redundant and can be removed
export default root;
