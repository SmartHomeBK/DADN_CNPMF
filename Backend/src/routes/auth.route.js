import { Router } from 'express';
import { login, SignUp } from '../controller/auth.controller.js';

const route = Router();

route.post('/login', login);
route.post('/signup', SignUp);
export const AuthRouter = route;
