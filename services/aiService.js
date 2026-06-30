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
  
    CRITICAL SCORING RUBRIC:
    Calculate the "matchPercentage" objectively out of 100 based on these exact allocations:
    - Core Skill Alignment (Max 40 points): Proportion of hard/technical skills present in both documents.
    - Experience & Role Relevance (Max 35 points): Alignment of previous job titles, responsibilities, and seniority.
    - Education & Certifications (Max 15 points): Matching degrees, required certifications, or specific domain training.
    - Formatting & Keywords (Max 10 points): Clean readability, absence of tracking errors, and precise keyword matches.
    
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
      responseMimeType: "application/json",
      temperature: 0,
      systemInstruction: `
        You are an objective, strict Applicant Tracking System (ATS) parsing tool. 
        Your sole job is to cross-examine the given Resume against the Job Description. 
        
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