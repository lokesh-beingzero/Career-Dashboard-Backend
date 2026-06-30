import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdfParseModule = await import ('pdf-parse');
const pdfParse = pdfParseModule.PDFParse;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Gemini SDK (Using 2026 Recommended @google/genai)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_optimizer')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schema
// const AnalysisSchema = new mongoose.Schema({
//   createdAt: { type: Date, default: Date.now },
//   jobDescription: String,
//   analysisResult: Object
// });
// const Analysis = mongoose.model('Analysis', AnalysisSchema);

// 3. Configure Multer for In-Memory File Uploads
const upload = multer({ storage: multer.memoryStorage() });

// 4. Main API Endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Please upload a resume PDF.' });
    if (!jobDescription) return res.status(400).json({ error: 'Please provide a job description.' });

    // Extract text from the PDF buffer

    const uint8ArrayData = new Uint8Array(req.file.buffer);


    const pdfParseObj = new pdfParse(uint8ArrayData);
    const pdfData = await pdfParseObj.getText();
    console.log('pdfData = ', pdfData);

    const resumeText = pdfData.text;

    // Structured Prompt enforcing JSON response matching UI expectations
    const prompt = `
      You are an elite Applicant Tracking System (ATS) optimizer. Analyze the following Resume against the Job Description.
      
      Resume Text:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
      
      Provide actionable feedback. Return a JSON object matching this schema precisely:
      {
        "matchPercentage": number,
        "summary": "string summary of alignment",
        "missingKeywords": ["keyword1", "keyword2"],
        "actionableFixes": [
          { "section": "Experience/Skills/etc", "issue": "problem found", "fix": "how to resolve" }
        ],
        "enhancedBulletPoints": [
          { "original": "old bullet point", "suggested": "optimized bullet point", "reason": "why this helps" }
        ]
      }
    `;

    // Generate content using gemini-2.5-flash
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const reportData = JSON.parse(aiResponse.text);

    // // Save history to MongoDB
    // const savedRecord = new Analysis({
    //   jobDescription,
    //   analysisResult: reportData
    // });
    // await savedRecord.save();

    // Send JSON report back to React
    return res.json(reportData);

  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({ error: 'Internal Server Error processing your request.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));