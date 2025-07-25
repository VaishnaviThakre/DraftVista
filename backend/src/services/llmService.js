const { GoogleGenerativeAI } = require('@google/generative-ai');

// Mock response for when the API is unavailable
const MOCK_RESPONSE = `
# AI-Generated Manuscript Review Report

## Executive Summary
This is a placeholder response as the AI service is currently unavailable. Please check your internet connection and try again later. Below is a sample of the analysis you would receive when the service is available.

## Detailed Section Assessment
### 1. Title and Abstract
- **Assessment**: Unable to assess due to service unavailability
- **Recommendations**: Please try again when the service is available

### 2. Introduction
- **Assessment**: Unable to assess due to service unavailability
- **Recommendations**: Please try again when the service is available

## Rigor Assessment
### 1. Originality and Impact
- **Assessment**: Unable to assess due to service unavailability
- **Recommendations**: Please try again when the service is available

## Writing Assessment
### 1. Language and Style
- **Assessment**: Unable to assess due to service unavailability
- **Recommendations**: Please try again when the service is available

## Overall Recommendations
1. Try again later when the AI service is available
2. Check your internet connection
3. Verify your API key is valid and has sufficient quota
`;

class LLMService {
  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      // Using the latest Gemini 2.5 Flash model - updated to the correct model name from Google's documentation
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });
      console.log('Gemini model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
      throw new Error(`Failed to initialize AI service: ${error.message}`);
    }
  }

  /**
   * Analyze manuscript for pre-submission feedback
   * @param {string} manuscriptText - Extracted manuscript text
   * @param {object} journalInfo - Journal information
   * @returns {Promise<object>} - Analysis results
   */
  async analyzePreSubmission(manuscriptText, journalInfo, retries = 2) {
    try {
      if (!this.model) {
        throw new Error('AI model is not properly initialized');
      }
      
      const prompt = this.buildPreSubmissionPrompt(manuscriptText, journalInfo);
      console.log('Sending request to Gemini API...');
      
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        
        if (!response || !response.text) {
          throw new Error('Invalid response format from AI model');
        }
        
        const text = response.text();
        console.log('Successfully received response from Gemini API');
        
        if (!text || text.trim() === '') {
          throw new Error('Received empty response from the AI model');
        }
        
        return this.parseLLMResponse(text, 'pre-submission');
        
      } catch (apiError) {
        console.error('API Error:', apiError);
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts remaining)`);
          // Wait for 3 seconds before retrying (increased for better network stability)
          await new Promise(resolve => setTimeout(resolve, 3000));
          return this.analyzePreSubmission(manuscriptText, journalInfo, retries - 1);
        }
        throw apiError; // Re-throw if no retries left
      }
      
    } catch (error) {
      console.error('LLM Pre-submission analysis error:', error);
      
      // Return mock response if we can't connect to the API
      if (error.message.includes('unavailable') || 
          error.message.includes('connection') || 
          error.message.includes('timeout') ||
          error.message.includes('ECONNREFUSED')) {
        console.warn('Falling back to mock response');
        return {
          sections: [
            { title: 'API Service Unavailable', content: MOCK_RESPONSE }
          ],
          isMock: true
        };
      }
      
      // Handle specific Gemini API errors
      if (error.message.includes('404') || error.message.includes('not found')) {
        throw new Error('The AI model is currently unavailable. Please try again later.');
      } else if (error.message.includes('quota') || error.message.includes('exceeded')) {
        throw new Error('API quota exceeded. Please check your API key or try again later.');
      } else if (error.message.includes('API key') || error.message.includes('authentication')) {
        throw new Error('Invalid API key. Please check your Google AI API key configuration.');
      } else if (error.message.includes('content policy')) {
        throw new Error('The content was blocked by the AI service. Please try with different content.');
      } else if (error.message.includes('model')) {
        throw new Error('The selected AI model is not available. Please contact support.');
      }
      
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze manuscript for post-rejection feedback
   * @param {string} manuscriptText - Extracted manuscript text
   * @param {object} journalInfo - Journal information
   * @param {string} reviewerComments - Reviewer comments
   * @returns {Promise<object>} - Analysis results
   */
  async analyzePostRejection(manuscriptText, journalInfo, reviewerComments, retries = 2) {
    try {
      if (!this.model) {
        throw new Error('AI model is not properly initialized');
      }
      
      const prompt = this.buildPostRejectionPrompt(manuscriptText, journalInfo, reviewerComments);
      console.log('Sending post-rejection request to Gemini API...');
      
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        
        if (!response || !response.text) {
          throw new Error('Invalid response format from AI model');
        }
        
        const text = response.text();
        console.log('Successfully received post-rejection response from Gemini API');
        
        if (!text || text.trim() === '') {
          throw new Error('Received empty response from the AI model');
        }
        
        return this.parseLLMResponse(text, 'post-rejection');
        
      } catch (apiError) {
        console.error('API Error in post-rejection analysis:', apiError);
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts remaining)`);
          await new Promise(resolve => setTimeout(resolve, 1500)); // Slightly longer delay for post-rejection
          return this.analyzePostRejection(manuscriptText, journalInfo, reviewerComments, retries - 1);
        }
        throw apiError; // Re-throw if no retries left
      }
      
    } catch (error) {
      console.error('LLM Post-rejection analysis error:', error);
      
      // Return mock response if we can't connect to the API
      if (error.message.includes('unavailable') || 
          error.message.includes('connection') || 
          error.message.includes('timeout') ||
          error.message.includes('ECONNREFUSED')) {
        console.warn('Falling back to mock response for post-rejection');
        return {
          sections: [
            { 
              title: 'API Service Unavailable', 
              content: MOCK_RESPONSE + '\n\n## Note: This is a mock response. The actual analysis would include detailed feedback on the reviewer comments.' 
            }
          ],
          isMock: true
        };
      }
      
      // Handle specific Gemini API errors with more detailed messages
      if (error.message.includes('404') || error.message.includes('not found')) {
        throw new Error('The AI model is currently unavailable. Please try again later.');
      } else if (error.message.includes('quota') || error.message.includes('exceeded')) {
        throw new Error('API quota exceeded. Please check your API key or try again later.');
      } else if (error.message.includes('API key') || error.message.includes('authentication')) {
        throw new Error('Invalid API key. Please check your Google AI API key configuration.');
      } else if (error.message.includes('content policy')) {
        throw new Error('The content was blocked by the AI service. Please try with different content.');
      } else if (error.message.includes('model')) {
        throw new Error('The selected AI model is not available. Please contact support.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timed out. The server took too long to respond. Please try again.');
      }
      
      throw new Error(`Post-rejection analysis failed: ${error.message}`);
    }
  }

  /**
   * Build prompt for pre-submission analysis
   * @param {string} manuscriptText - Manuscript content
   * @param {object} journalInfo - Journal information
   * @returns {string} - Formatted prompt
   */
  buildPreSubmissionPrompt(manuscriptText, journalInfo) {
    const instructions = [
      'You are an expert academic reviewer with extensive experience in reviewing for high-impact journals.',
      `TARGET JOURNAL: ${journalInfo.name || 'Not specified'}`,
      'YOUR TASK: Provide a comprehensive, detailed review following this exact structure:',
      '',
      '# AI-Generated Manuscript Review Report',
      '## Executive Summary',
      '[Provide a 3-5 sentence overview of the manuscript\'s strengths, weaknesses, and overall assessment]',
      '',
      '## Detailed Section Assessment',
      '### 1. Title and Abstract',
      '- **Assessment**: [Concise evaluation of clarity, informativeness, and alignment with content]',
      '- **Recommendations**: [Specific, actionable suggestions]',
      '',
      '### 2. Introduction',
      '- **Assessment**: [Evaluation of literature review, gap identification, and rationale]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '### 3. Methodology',
      '- **Assessment**: [Evaluation of rigor, reproducibility, and appropriateness]',
      '- **Recommendations**: [Specific methodological improvements]',
      '',
      '### 4. Results',
      '- **Assessment**: [Evaluation of data presentation and analysis]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '### 5. Discussion and Conclusion',
      '- **Assessment**: [Evaluation of interpretation and implications]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '## Rigor Assessment',
      '### 1. Originality and Impact',
      '- **Assessment**: [Evaluation of novelty and contribution]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '### 2. Technical Soundness',
      '- **Assessment**: [Evaluation of methodology and analysis]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '## Writing Assessment',
      '### 1. Language and Style',
      '- **Assessment**: [Evaluation of clarity, conciseness, and academic tone]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '### 2. Structure and Flow',
      '- **Assessment**: [Evaluation of logical organization]',
      '- **Recommendations**: [Specific suggestions for improvement]',
      '',
      '## Overall Recommendations',
      '1. [Priority 1 recommendation]',
      '2. [Priority 2 recommendation]',
      '3. [Priority 3 recommendation]',
      '',
      '## Suitability for Target Journal',
      '- **Assessment**: [Specific evaluation of fit with the target journal]',
      '- **Recommendations**: [Specific suggestions for improving fit]',
      '',
      'INSTRUCTIONS:',
      '1. Be specific, constructive, and provide examples from the text.',
      '2. Use clear section headers and maintain a professional, academic tone.',
      '3. Focus on actionable feedback that the authors can implement.',
      '4. Ensure all sections are addressed, even if briefly.',
      '5. If a section is missing or cannot be evaluated, state this explicitly.',
      '',
      'MANUSCRIPT CONTENT (first 30,000 characters):',
      manuscriptText.substring(0, 30000)
    ].join('\n');
    
    return instructions;
  }

  /**
   * Build prompt for post-rejection analysis
   * @param {string} manuscriptText - Manuscript content
   * @param {object} journalInfo - Journal information
   * @param {string} reviewerComments - Reviewer feedback
   * @returns {string} - Formatted prompt
   */
  buildPostRejectionPrompt(manuscriptText, journalInfo, reviewerComments) {
    return [
      'You are an experienced academic reviewer with expertise in helping authors respond to reviewer comments and improve their manuscripts.',
      `TARGET JOURNAL: ${journalInfo.name || 'Not specified'}`,
      'YOUR TASK: Provide a detailed analysis of the reviewer comments and specific guidance for the authors to address them effectively.',
      '',
      '# Response to Reviewer Comments - Analysis and Recommendations',
      '## Summary of Reviewers\' Concerns',
      '[Provide a concise summary of the main concerns raised by the reviewers]',
      '',
      '## Detailed Response to Each Comment',
      'For each major comment from the reviewers, provide:',
      '1. **Reviewer Comment**: [The exact comment]',
      '2. **Our Interpretation**: [Clarify what the reviewer is asking for]',
      '3. **Suggested Response**: [How to address the comment]',
      '4. **Manuscript Changes**: [Specific changes needed in the manuscript]',
      '',
      '## Overall Strategy for Revision',
      '1. [Key strategy point 1]',
      '2. [Key strategy point 2]',
      '3. [Key strategy point 3]',
      '',
      '## Specific Recommendations by Section',
      '### 1. Introduction',
      '- [Specific recommendations]',
      '',
      '### 2. Methods',
      '- [Specific recommendations]',
      '',
      '### 3. Results',
      '- [Specific recommendations]',
      '',
      '### 4. Discussion',
      '- [Specific recommendations]',
      '',
      '## Additional Suggestions',
      '- [Any other suggestions not directly related to reviewer comments]',
      '',
      'REVIEWER COMMENTS:',
      reviewerComments,
      '',
      'MANUSCRIPT CONTENT (first 30,000 characters):',
      manuscriptText.substring(0, 30000),
      '',
      'INSTRUCTIONS:',
      '1. Be thorough but concise in your analysis.',
      '2. Provide specific, actionable recommendations.',
      '3. Maintain a constructive, professional tone.',
      '4. Where possible, suggest specific text changes or additions.',
      '5. Focus on addressing the reviewers\' concerns while maintaining the integrity of the research.'
    ].join('\n');
  }

  /**
   * Parse LLM response into structured format
   * @param {string} analysisText - Raw LLM response
   * @param {string} analysisType - Analysis type
   * @returns {object} - Structured analysis
   */
  parseLLMResponse(text, analysisType) {
    // Enhanced parsing of markdown sections with better handling of nested structures
    const sections = [];
    const lines = text.split('\n');
    let currentSection = { title: 'Full Response', content: '', subsections: [] };
    let currentSubsection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle section headers (##)
      if (line.startsWith('## ')) {
        if (currentSection.content || currentSection.subsections.length > 0) {
          // If we have a current subsection, add it before starting a new section
          if (currentSubsection) {
            currentSection.subsections.push({ ...currentSubsection });
            currentSubsection = null;
          }
          sections.push({ ...currentSection });
        }
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: '',
          subsections: []
        };
      }
      // Handle subsection headers (###)
      else if (line.startsWith('### ')) {
        if (currentSubsection) {
          currentSection.subsections.push({ ...currentSubsection });
        }
        currentSubsection = {
          title: line.replace('### ', '').trim(),
          content: ''
        };
      }
      // Handle content
      else if (line) {
        if (currentSubsection) {
          currentSubsection.content += line + '\n';
        } else {
          currentSection.content += line + '\n';
        }
      }
    }
    
    // Add any remaining sections/subsections
    if (currentSubsection) {
      currentSection.subsections.push({ ...currentSubsection });
    }
    if (currentSection.content || currentSection.subsections.length > 0) {
      sections.push({ ...currentSection });
    }
    
    // If no sections were created (unlikely with new prompt), return the full text
    if (sections.length === 0) {
      return {
        sections: [{
          title: 'Analysis Results',
          content: text,
          subsections: []
        }]
      };
    }
    
    return { 
      sections,
      analysisType,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Extract sections from analysis text
   * @param {string} text - Analysis text
   * @returns {object} - Extracted sections
   */
  extractSections(text) {
    const sections = {};
    
    // Simple section extraction based on numbered lists or headers
    const sectionPatterns = [
      /(?:^|\n)\*\*([^*]+)\*\*:?\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/g,
      /(?:^|\n)(\d+)\.\s*\*\*([^*]+)\*\*:?\s*([^\n]*(?:\n(?!\d+\.)[^\n]*)*)/g,
      /(?:^|\n)##?\s*([^\n]+)\n([^\n]*(?:\n(?!##?)[^\n]*)*)/g
    ];
    
    for (const pattern of sectionPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const title = match[2] || match[1];
        const content = match[3] || match[2];
        if (title && content) {
          sections[title.trim()] = content.trim();
        }
      }
    }
    
    return sections;
  }

  /**
   * Extract executive summary
   * @param {string} text - Analysis text
   * @returns {string} - Summary
   */
  extractSummary(text) {
    const summaryMatch = text.match(/(?:executive summary|summary)[:\s]*([^\n]*(?:\n(?!(?:\*\*|\d+\.|##?))[^\n]*)*)/i);
    return summaryMatch ? summaryMatch[1].trim() : text.substring(0, 500) + '...';
  }

  /**
   * Extract recommendations
   * @param {string} text - Analysis text
   * @returns {string[]} - List of recommendations
   */
  extractRecommendations(text) {
    const recommendations = [];
    
    // Look for recommendation sections
    const recMatch = text.match(/(?:recommendations?|suggestions?)[:\s]*([^\n]*(?:\n(?!(?:\*\*|\d+\.|##?))[^\n]*)*)/i);
    
    if (recMatch) {
      const recText = recMatch[1];
      // Extract bullet points or numbered items
      const bullets = recText.match(/(?:^|\n)[-*•]\s*([^\n]+)/g);
      const numbered = recText.match(/(?:^|\n)\d+\.\s*([^\n]+)/g);
      
      if (bullets) {
        recommendations.push(...bullets.map(b => b.replace(/^[-*•]\s*/, '').trim()));
      }
      if (numbered) {
        recommendations.push(...numbered.map(n => n.replace(/^\d+\.\s*/, '').trim()));
      }
    }
    
    return recommendations.length > 0 ? recommendations : ['Review the detailed analysis for specific improvement suggestions.'];
  }
}

module.exports = new LLMService();
