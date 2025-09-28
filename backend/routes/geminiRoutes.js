import express from 'express';
import {summarizeWebsite, generateGreeting } from '../controllers/geminiController.js';

const router = express.Router();

// Simple connectivity test
router.post('/test', generateGreeting);

// Summarize a website (accepts { url })
router.post('/summarize', summarizeWebsite);

export default router;
