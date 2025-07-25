# Manuscript Reviewer Backend

A Node.js/Express backend API for analyzing research manuscripts using AI.

## Features

- **Pre-submission Analysis**: Analyze manuscripts before submission to identify potential issues
- **Post-rejection Analysis**: Understand why manuscripts were rejected and get improvement suggestions
- **File Processing**: Support for PDF and Word documents (.pdf, .docx, .doc)
- **Journal Intelligence**: Scrape journal guidelines and requirements
- **AI-Powered Analysis**: Uses OpenAI GPT-4 for comprehensive manuscript review

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```

### Test Endpoint
```
GET /api/test
```

### Pre-submission Analysis
```
POST /api/analyze-pre-submission
Content-Type: multipart/form-data

Fields:
- manuscript: File (PDF/DOCX/DOC)
- journalUrl: String (Journal website URL)
```

### Post-rejection Analysis
```
POST /api/analyze-post-rejection
Content-Type: multipart/form-data

Fields:
- manuscript: File (PDF/DOCX/DOC)
- journalUrl: String (Journal website URL)
- reviewerComments: String (Reviewer feedback)
```

## Response Format

```json
{
  "success": true,
  "analysisType": "pre-submission",
  "manuscript": {
    "filename": "paper.pdf",
    "size": 1024000
  },
  "journal": {
    "url": "https://journal.example.com",
    "name": "Example Journal"
  },
  "analysis": {
    "type": "pre-submission",
    "fullAnalysis": "Detailed analysis text...",
    "sections": {
      "Executive Summary": "...",
      "Methodological Assessment": "..."
    },
    "summary": "Brief summary...",
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "generatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express server setup
│   ├── routes/
│   │   └── analyze.js      # Analysis endpoints
│   ├── services/
│   │   ├── fileService.js  # File processing (PDF/Word)
│   │   ├── llmService.js   # OpenAI integration
│   │   └── journalService.js # Journal scraping
│   └── utils/
│       └── cleanup.js      # File cleanup utilities
├── uploads/                # Temporary file storage
├── package.json
├── .env.example
└── README.md
```

## File Processing

- **PDF**: Uses `pdf-parse` to extract text content
- **Word**: Uses `mammoth` to extract text from .docx/.doc files
- **Validation**: File type and size validation
- **Cleanup**: Automatic cleanup of uploaded files after processing

## Journal Intelligence

- **Web Scraping**: Extracts journal information from URLs
- **Known Journals**: Database of common journals (Nature, IEEE, Springer, etc.)
- **Fallback**: Graceful handling when scraping fails

## AI Analysis

- **Model**: OpenAI GPT-4
- **Prompts**: Specialized prompts for pre-submission vs post-rejection analysis
- **Structure**: Parses AI responses into structured sections
- **Error Handling**: Robust error handling for API failures

## Error Handling

- File upload validation
- API rate limiting protection
- Graceful fallbacks for journal scraping
- Comprehensive error logging
- User-friendly error messages

## Security

- File type validation
- File size limits
- CORS configuration
- Input sanitization
- Temporary file cleanup

## Development

```bash
# Install development dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Check logs
tail -f logs/app.log
```

## Deployment

1. Set environment variables
2. Install production dependencies: `npm install --production`
3. Start with process manager: `pm2 start src/app.js`

## Requirements

- Node.js 16+
- OpenAI API key
- Internet connection for journal scraping

## License

ISC
