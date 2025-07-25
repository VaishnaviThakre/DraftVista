const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
// Simple unique ID generator
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Import services
const fileService = require('../services/fileService');
const llmService = require('../services/llmService');
const journalService = require('../services/journalService');
const cleanupService = require('../utils/cleanup');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${generateUniqueId()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and DOC files are allowed.'));
    }
  }
});

// POST /api/analyze-pre-submission
router.post('/analyze-pre-submission', upload.single('manuscript'), async (req, res) => {
  let filePath = null;
  
  try {
    const { journalUrl } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        error: 'No manuscript file provided',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!journalUrl) {
      return res.status(400).json({
        error: 'Journal URL is required',
        timestamp: new Date().toISOString()
      });
    }
    
    filePath = req.file.path;
    console.log(`📄 Processing pre-submission analysis for: ${req.file.originalname}`);
    
    // Extract text from manuscript
    const manuscriptText = await fileService.extractText(filePath);
    
    // Get journal information
    const journalInfo = await journalService.getJournalInfo(journalUrl);
    
    // Perform LLM analysis
    const analysis = await llmService.analyzePreSubmission(manuscriptText, journalInfo);
    
    // Cleanup file
    await cleanupService.deleteFile(filePath);
    
    res.json({
      success: true,
      analysisType: 'pre-submission',
      manuscript: {
        filename: req.file.originalname,
        size: req.file.size
      },
      journal: {
        url: journalUrl,
        name: journalInfo.name || 'Unknown Journal'
      },
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Pre-submission analysis error:', error);
    
    // Cleanup file on error
    if (filePath) {
      await cleanupService.deleteFile(filePath);
    }
    
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/analyze-post-rejection
router.post('/analyze-post-rejection', upload.single('manuscript'), async (req, res) => {
  let filePath = null;
  
  try {
    const { journalUrl, reviewerComments } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        error: 'No manuscript file provided',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!journalUrl) {
      return res.status(400).json({
        error: 'Journal URL is required',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!reviewerComments) {
      return res.status(400).json({
        error: 'Reviewer comments are required for post-rejection analysis',
        timestamp: new Date().toISOString()
      });
    }
    
    filePath = req.file.path;
    console.log(`📄 Processing post-rejection analysis for: ${req.file.originalname}`);
    
    // Extract text from manuscript
    const manuscriptText = await fileService.extractText(filePath);
    
    // Get journal information
    const journalInfo = await journalService.getJournalInfo(journalUrl);
    
    // Perform LLM analysis
    const analysis = await llmService.analyzePostRejection(manuscriptText, journalInfo, reviewerComments);
    
    // Cleanup file
    await cleanupService.deleteFile(filePath);
    
    res.json({
      success: true,
      analysisType: 'post-rejection',
      manuscript: {
        filename: req.file.originalname,
        size: req.file.size
      },
      journal: {
        url: journalUrl,
        name: journalInfo.name || 'Unknown Journal'
      },
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Post-rejection analysis error:', error);
    
    // Cleanup file on error
    if (filePath) {
      await cleanupService.deleteFile(filePath);
    }
    
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/test
router.get('/test', (req, res) => {
  res.json({
    message: 'Manuscript Reviewer API is working!',
    endpoints: [
      'POST /api/analyze-pre-submission',
      'POST /api/analyze-post-rejection'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
