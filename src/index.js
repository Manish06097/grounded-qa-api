import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import { handleQuery, handleHealth } from './controllers/queryController.js';

const app = express();

// ====================
// Middleware
// ====================

// Security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Rate limiting - 30 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request logging (simple)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} | ${req.method} ${req.path}`);
  next();
});

// ====================
// Routes
// ====================

// Health check endpoint
app.get('/health', handleHealth);

// Main query endpoint
app.post('/query', handleQuery);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    availableEndpoints: {
      'POST /query': 'Submit a question to get a grounded answer',
      'GET /health': 'Check API health status',
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// ====================
// Server
// ====================

const server = app.listen(config.port, () => {
  console.log('');
  console.log('🚀 Grounded Q&A API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Running on: http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log('');
  console.log('📖 Endpoints:');
  console.log(`   POST /query  - Submit a question`);
  console.log(`   GET  /health - Health check`);
  console.log('');
  console.log('✨ Ready to accept requests!');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT. Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
