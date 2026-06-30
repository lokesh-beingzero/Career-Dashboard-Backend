import { extractTextFromPdf } from '../services/pdfService.js';
import { analyzeResumeWithAI } from '../services/aiService.js';

export const handleResumeAnalysis = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume PDF.' });
    }
    if (!jobDescription) {
      return res.status(400).json({ error: 'Please provide a job description.' });
    }

    // 1. Extract text from the PDF buffer via PDF Service
    const resumeText = await extractTextFromPdf(req.file.buffer);

    // 2. Generate analysis via AI Service
    const reportData = await analyzeResumeWithAI(resumeText, jobDescription);

    // 3. Return the payload back to the client
    return res.json(reportData);

  } catch (error) {
    console.error('Error in handleResumeAnalysis controller:', error);
    return res.status(500).json({ error: 'Internal Server Error processing your request.' });
  }
};