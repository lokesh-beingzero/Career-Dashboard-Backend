import { ai } from '../config/gemini.js';

/**
 * Compares a resume text against a job description using Gemini AI
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<object>} Parsed structured JSON report
 */
export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
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

  const aiResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(aiResponse.text);
};