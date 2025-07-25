const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class FileService {
  /**
   * Extract text content from uploaded file
   * @param {string} filePath - Path to the uploaded file
   * @returns {Promise<string>} - Extracted text content
   */
  async extractText(filePath) {
    try {
      const fileExt = path.extname(filePath).toLowerCase();
      
      switch (fileExt) {
        case '.pdf':
          return await this.extractFromPDF(filePath);
        case '.docx':
        case '.doc':
          return await this.extractFromWord(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileExt}`);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text from file: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<string>} - Extracted text
   */
  async extractFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('No readable text found in PDF. The file might be scanned or corrupted.');
      }
      
      return this.cleanText(data.text);
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from Word document
   * @param {string} filePath - Path to Word file
   * @returns {Promise<string>} - Extracted text
   */
  async extractFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No readable text found in Word document.');
      }
      
      if (result.messages && result.messages.length > 0) {
        console.warn('Word extraction warnings:', result.messages);
      }
      
      return this.cleanText(result.value);
    } catch (error) {
      throw new Error(`Word document extraction failed: ${error.message}`);
    }
  }

  /**
   * Clean and normalize extracted text
   * @param {string} text - Raw extracted text
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  }

  /**
   * Validate file before processing
   * @param {string} filePath - Path to file
   * @returns {Promise<object>} - File validation info
   */
  async validateFile(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const fileExt = path.extname(filePath).toLowerCase();
      const allowedTypes = ['.pdf', '.docx', '.doc'];
      
      return {
        exists: true,
        size: stats.size,
        extension: fileExt,
        isSupported: allowedTypes.includes(fileExt),
        sizeInMB: (stats.size / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }

  /**
   * Get file information for logging
   * @param {string} filePath - Path to file
   * @returns {Promise<object>} - File info
   */
  async getFileInfo(filePath) {
    try {
      const validation = await this.validateFile(filePath);
      const fileName = path.basename(filePath);
      
      return {
        name: fileName,
        path: filePath,
        ...validation
      };
    } catch (error) {
      return {
        name: path.basename(filePath),
        path: filePath,
        error: error.message
      };
    }
  }
}

module.exports = new FileService();
