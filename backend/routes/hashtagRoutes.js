import { Router } from 'express';
import { generateHashtags } from '../controllers/hashtagController.js';

const router = Router();

// Define the route: POST /api/hashtags/generate
router.post('/genfromyt', generateHashtags);
export default router;
