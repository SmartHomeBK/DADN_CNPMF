import express from 'express';
import { chatWithAI } from '../controller/chatbot.controller.js';

const router = express.Router();

router.post('/chat', chatWithAI);

export default router;
