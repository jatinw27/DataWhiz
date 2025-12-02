// routes/chatbot.route.js
import express from 'express';
import Message from '../controllers/chatbot.msg.js';   // default import

const router = express.Router();

router.post('/message', Message);   // Message is now a real function

export default router;