# Manuscript Reviewer - AI-Powered Academic Paper Analysis

An intelligent web application that helps researchers analyze their manuscripts before submission, providing detailed feedback on potential rejection reasons, formatting issues, and improvement suggestions.

## 🚀 Features

### Core Functionality
- **Pre-submission Analysis**: Analyze manuscripts before journal submission
- **Post-submission Analysis**: Understand rejection reasons from reviewer comments
- **Journal-specific Guidelines**: Automatic extraction of journal formatting requirements
- **AI-powered Insights**: GPT-4 powered analysis for comprehensive feedback
- **Multi-format Support**: PDF and DOCX file processing

### Analysis Components
- **Grammar & Style Analysis**: Identify writing issues and improvement suggestions
- **Format Compliance**: Check adherence to journal-specific formatting guidelines
- **Content Quality Assessment**: Evaluate research novelty, methodology, and presentation
- **Actionable Recommendations**: Prioritized improvement suggestions

## 🏗️ Architecture

### Frontend (Next.js + React)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS for responsive design
- **Components**: React functional components with TypeScript
- **File Upload**: Custom drag-and-drop interface
- **Form Validation**: Client-side validation with real-time feedback
- **Demo Mode**: Frontend-only demonstration with mock data

**Note**: This is currently a frontend-only demonstration. The backend components have been removed to create a pure frontend showcase.

## 📋 Prerequisites

- Node.js 18+ and npm

## 🚀 Quick Start

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd manuscript-reviewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

**Note**: This is a frontend-only demonstration. All backend functionality has been replaced with mock data and demo messages.

## ⚙️ Configuration

### Environment Variables

No environment variables are required for this frontend-only demonstration.

In a full implementation, you would need:
- `NEXT_PUBLIC_API_URL` for backend API endpoint
- Backend environment variables for database, Redis, and OpenAI API

## 📚 API Documentation

### Main Endpoints

#### Submit Manuscript
```http
POST /api/submit
Content-Type: multipart/form-data

Parameters:
- file: PDF or DOCX manuscript file
- journalUrl: Target journal URL
- status: "Not submitted" or "Submitted"
- comments: Reviewer comments (required if status is "Submitted")
```

#### Get Analysis Results
```http
GET /api/analysis/{project_id}
```

#### Get Project Status
```http
GET /api/project/{project_id}
```

### Response Format

```json
{
  "project_id": "uuid",
  "analysis_status": "completed",
  "analysis_results": {
    "overall_score": 85.5,
    "grammar_issues": [...],
    "format_issues": [...],
    "content_issues": [...],
    "recommendations": [...],
    "rejection_reasons": [...]
  }
}
```

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

## 📁 Project Structure

```
manuscript-reviewer/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── components/      # Reusable components
│   │   ├── submit/          # Submission page
│   │   ├── results/         # Results pages
│   │   ├── about/           # About page
│   │   ├── terms/           # Terms page
│   │   └── globals.css      # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── next.config.ts           # Next.js configuration
└── tsconfig.json           # TypeScript configuration
├── docker-compose.yml     # Development setup
└── README.md
```

### Adding New Features

1. **Backend**: Add new routes in `backend/app/api/routes/`
2. **Frontend**: Add new pages in `src/app/`
3. **Database**: Update models in `backend/app/models.py`
4. **Services**: Add business logic in `backend/app/services/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the health check endpoint at `/health`

## 🔮 Future Enhancements

- [ ] User authentication and project management
- [ ] Batch processing for multiple manuscripts
- [ ] Integration with journal submission systems
- [ ] Advanced plagiarism detection
- [ ] Citation analysis and recommendations
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Real-time collaboration features
