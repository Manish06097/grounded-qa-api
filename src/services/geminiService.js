import { GoogleGenAI } from '@google/genai';
import config from '../config/env.js';
import { buildSystemPrompt, buildUserPrompt } from '../prompts/systemPrompt.js';

// Initialize Gemini client with @google/genai SDK v1.38+
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

/**
 * Generates a grounded answer using Gemini
 * 
 * @param {string} question - The user's question
 * @param {string} knowledgeText - The knowledge base content
 * @returns {Promise<string>} The generated answer
 */
export async function generateAnswer(question, knowledgeText) {
  const systemPrompt = buildSystemPrompt(knowledgeText);
  const userPrompt = buildUserPrompt(question);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // Low temperature to reduce creativity/hallucination
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 256, // Keep responses concise
      },
    });

    const answer = response.text.trim();
    return answer;

  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Full error:', JSON.stringify(error, null, 2));
    
    // Handle specific error cases
    if (error.message && (error.message.includes('API_KEY') || error.message.includes('api_key'))) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY.');
    }
    if (error.message && error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    
    throw new Error('Failed to generate response. Please try again.');
  }
}
