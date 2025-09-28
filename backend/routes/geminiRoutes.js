import express from 'express';
import {summarizeWebsite, tagWebsite } from '../controllers/geminiController.js';

const router = express.Router();

// Simple connectivity test
router.post('/tags', tagWebsite);

// Summarize a website (accepts { url })
router.post('/summarize', summarizeWebsite);

export default router;
