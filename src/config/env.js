import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
};

// Validate required environment variables
if (!config.geminiApiKey) {
  console.error('❌ GEMINI_API_KEY is required. Please set it in your .env file.');
  console.error('   Get your API key at: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

export default config;
