import express from 'express';
import { summarizeWebsite } from '../controllers/geminiController.js';

const router = express.Router();

// POST /api/gemini/summarize
router.post('/summarize', summarizeWebsite);

export default router;
