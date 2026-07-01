import { Router } from 'express';
import multer from 'multer';
import { handleResumeAnalysis } from '../controllers/analyzeController.js';

const router = Router();

// Configure Multer for In-Memory File Uploads locally to this router
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), handleResumeAnalysis);

export default router;