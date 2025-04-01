import { Router } from 'express';
import {
    getAllHistory,
    getHistoryByDeviceName,
    getHistoryByUserName,
} from '../controller/history.controller.js';
const route = Router();

route.get('', getAllHistory);
route.get('/search/user/:userName', getHistoryByUserName);
route.get('/search/device/:deviceName', getHistoryByDeviceName);
export const HistoryRoute = route;
