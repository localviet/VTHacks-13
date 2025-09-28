import { Router } from 'express';
import { generateHashtags } from '../controllers/hashtagController.js';
//import { genfromweb } from '../controllers/hashfromwebController.js';

const router = Router();

// Define the route: POST /api/hashtags/generate
router.post('/genfromyt', generateHashtags);
//router.post('/genfromweb', genfromweb);

export default router;
