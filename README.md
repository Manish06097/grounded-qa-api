# Grounded Q&A API

A Node.js Express API that answers questions strictly from a local knowledge file using Google Gemini, with advanced prompt engineering to prevent AI hallucinations.

## Setup & Run

```bash
npm install
cp .env.example .env  # Add your GEMINI_API_KEY
npm run dev           # Server runs on http://localhost:3001
```

## Usage

```bash
curl -X POST http://localhost:3001/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the price?"}'
```

Returns `{"answer": "..."}` grounded in `data/data.txt`, or `"I don't have enough information to answer this."` if not found.
