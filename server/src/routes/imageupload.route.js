// imageupload.route.js
import express from 'express';
import { generateSignature } from '../controllers/uploadController.js';
import auth from '../middleware/auth.js'; // Your authentication middleware

const router = express.Router();

// Route to generate the upload signature
router.post('/generate-signature', auth, generateSignature);

export default router;