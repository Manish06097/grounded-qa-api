import { generateAnswer } from '../services/geminiService.js';
import { loadKnowledge } from '../utils/knowledgeLoader.js';

/**
 * Handles POST /query requests
 * Validates input, loads knowledge, and returns grounded answers
 */
export async function handleQuery(req, res) {
  const { question } = req.body;

  // Input validation
  if (!question) {
    return res.status(400).json({
      error: 'Missing required field: question',
      usage: 'POST /query with JSON body: { "question": "your question" }',
    });
  }

  if (typeof question !== 'string') {
    return res.status(400).json({
      error: 'Field "question" must be a string',
    });
  }

  if (question.trim().length === 0) {
    return res.status(400).json({
      error: 'Field "question" cannot be empty',
    });
  }

  if (question.length > 1000) {
    return res.status(400).json({
      error: 'Question is too long. Maximum 1000 characters allowed.',
    });
  }

  try {
    // Load knowledge base
    const knowledgeText = loadKnowledge();

    // Generate grounded answer
    const answer = await generateAnswer(question.trim(), knowledgeText);

    // Return response
    return res.json({ answer });

  } catch (error) {
    console.error('❌ Query error:', error.message);
    
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred',
    });
  }
}

/**
 * Handles GET /health requests
 * Returns server health status
 */
export function handleHealth(req, res) {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'grounded-qa-api',
  });
}
