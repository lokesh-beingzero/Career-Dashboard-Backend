import { ai } from '../config/gemini.js';

/**
 * Compares a resume text against a job description using Gemini AI
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<object>} Parsed structured JSON report
 */
export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const prompt = `Resume Text:\n${resumeText}\n\nJob Description:\n${jobDescription}`;

    const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0,
            systemInstruction: `
                You are an objective, strict Applicant Tracking System (ATS) parsing tool.
                
                CRITICAL TIME CONTEXT: 
                Today's current date is exactly ${currentDate}. 
                Evaluate all timelines, graduation dates, and employment durations against this date. Do not flag dates prior to ${currentDate} as future dates.
                
                SCORING CRITERIA:
                - 40% Technical Skills Alignment
                - 35% Experience Context & Level 
                - 15% Education/Certifications
                - 10% Keywords
                
                Always perform this exact formula mathematically. Be thoroughly consistent.

                Output Schema:
                {
                    "matchPercentage": number,
                    "summary": "string",
                    "missingKeywords": ["string"],
                    "actionableFixes": [{ "section": "string", "issue": "string", "fix": "string" }],
                    "enhancedBulletPoints": [{ "original": "string", "suggested": "string", "reason": "string" }]
                }
            `
        }
    });

    return JSON.parse(aiResponse.text);
};