import { Router } from 'express';
import {
    addDevice,
    controlDevice,
    getDevices,
    setAuto,
} from '../controller/device.controller.js';

const route = Router();

route.get('', getDevices);
route.post('', addDevice);
route.put('/control/:device', controlDevice);
route.put('/api/devices/auto/:device', setAuto);
export const DeviceRoute = route;
