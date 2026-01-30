import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cache the knowledge content to avoid repeated file reads
let cachedKnowledge = null;

/**
 * Loads the knowledge base from the data file
 * @returns {string} The knowledge base content
 */
export function loadKnowledge() {
  if (cachedKnowledge) {
    return cachedKnowledge;
  }

  const dataPath = path.join(__dirname, '../../data/data.txt');
  
  try {
    cachedKnowledge = fs.readFileSync(dataPath, 'utf-8').trim();
    console.log('📚 Knowledge base loaded successfully');
    return cachedKnowledge;
  } catch (error) {
    console.error('❌ Failed to load knowledge base:', error.message);
    throw new Error('Knowledge base file not found or unreadable');
  }
}

/**
 * Clears the knowledge cache (useful for testing or hot-reloading)
 */
export function clearKnowledgeCache() {
  cachedKnowledge = null;
}
