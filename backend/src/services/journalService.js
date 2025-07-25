const axios = require('axios');
const cheerio = require('cheerio');

class JournalService {
  constructor() {
    this.timeout = 30000; // 30 seconds timeout (increased for better reliability)
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  /**
   * Get journal information from URL
   * @param {string} journalUrl - Journal website URL
   * @returns {Promise<object>} - Journal information
   */
  async getJournalInfo(journalUrl) {
    try {
      console.log(`🔍 Fetching journal info from: ${journalUrl}`);
      
      // Validate URL
      if (!this.isValidUrl(journalUrl)) {
        throw new Error('Invalid journal URL provided');
      }

      // Try to scrape journal information
      const scrapedInfo = await this.scrapeJournalInfo(journalUrl);
      
      // Enhance with known journal data if available
      const enhancedInfo = this.enhanceWithKnownData(scrapedInfo, journalUrl);
      
      return {
        url: journalUrl,
        name: enhancedInfo.name || 'Unknown Journal',
        scope: enhancedInfo.scope || 'General academic research',
        guidelines: enhancedInfo.guidelines || 'Standard academic guidelines',
        publisher: enhancedInfo.publisher || 'Unknown Publisher',
        scrapedAt: new Date().toISOString(),
        ...enhancedInfo
      };
      
    } catch (error) {
      console.warn(`⚠️ Journal scraping failed: ${error.message}`);
      
      // Return fallback information
      return this.getFallbackJournalInfo(journalUrl);
    }
  }

  /**
   * Scrape journal information from website
   * @param {string} url - Journal URL
   * @returns {Promise<object>} - Scraped information
   */
  async scrapeJournalInfo(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        }
      });

      const $ = cheerio.load(response.data);
      
      return {
        name: this.extractJournalName($),
        scope: this.extractScope($),
        guidelines: this.extractGuidelines($),
        publisher: this.extractPublisher($),
        keywords: this.extractKeywords($),
        recentTopics: this.extractRecentTopics($)
      };
      
    } catch (error) {
      throw new Error(`Failed to scrape journal: ${error.message}`);
    }
  }

  /**
   * Extract journal name from page
   * @param {object} $ - Cheerio instance
   * @returns {string} - Journal name
   */
  extractJournalName($) {
    const selectors = [
      'title',
      'h1',
      '.journal-title',
      '.journal-name',
      '[data-journal-title]',
      '.site-title',
      '.brand-title'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        let name = element.text().trim();
        // Clean up title
        name = name.replace(/\s*\|\s*.*$/, ''); // Remove site suffix
        name = name.replace(/\s*-\s*.*$/, ''); // Remove dash suffix
        if (name.length > 5 && name.length < 200) {
          return name;
        }
      }
    }

    return null;
  }

  /**
   * Extract journal scope/description
   * @param {object} $ - Cheerio instance
   * @returns {string} - Scope description
   */
  extractScope($) {
    const selectors = [
      '.journal-description',
      '.about-journal',
      '.journal-scope',
      '.description',
      'meta[name="description"]',
      '.journal-aims',
      '.aims-scope'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = selector.includes('meta') ? 
          element.attr('content') : 
          element.text().trim();
        
        if (text && text.length > 50 && text.length < 1000) {
          return text;
        }
      }
    }

    return null;
  }

  /**
   * Extract submission guidelines
   * @param {object} $ - Cheerio instance
   * @returns {string} - Guidelines text
   */
  extractGuidelines($) {
    const selectors = [
      '.submission-guidelines',
      '.author-guidelines',
      '.instructions-authors',
      '.guidelines',
      '[href*="submission"]',
      '[href*="guidelines"]',
      '[href*="authors"]'
    ];

    const guidelines = [];

    for (const selector of selectors) {
      $(selector).each((i, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 20) {
          guidelines.push(text);
        }
      });
    }

    return guidelines.length > 0 ? guidelines.join(' | ') : null;
  }

  /**
   * Extract publisher information
   * @param {object} $ - Cheerio instance
   * @returns {string} - Publisher name
   */
  extractPublisher($) {
    const selectors = [
      '.publisher',
      '.publisher-name',
      '[data-publisher]',
      '.copyright',
      'footer .publisher'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        const publisher = element.text().trim();
        if (publisher.length > 3 && publisher.length < 100) {
          return publisher;
        }
      }
    }

    // Check for common publishers in URL or content
    const commonPublishers = ['springer', 'elsevier', 'ieee', 'acm', 'nature', 'wiley', 'taylor', 'sage'];
    const pageText = $('body').text().toLowerCase();
    
    for (const publisher of commonPublishers) {
      if (pageText.includes(publisher)) {
        return publisher.charAt(0).toUpperCase() + publisher.slice(1);
      }
    }

    return null;
  }

  /**
   * Extract keywords from page
   * @param {object} $ - Cheerio instance
   * @returns {string[]} - Keywords array
   */
  extractKeywords($) {
    const keywords = [];
    
    // Meta keywords
    const metaKeywords = $('meta[name="keywords"]').attr('content');
    if (metaKeywords) {
      keywords.push(...metaKeywords.split(',').map(k => k.trim()));
    }

    // Subject areas
    $('.subject-area, .keyword, .topic').each((i, element) => {
      const text = $(element).text().trim();
      if (text && text.length < 50) {
        keywords.push(text);
      }
    });

    return keywords.slice(0, 10); // Limit to 10 keywords
  }

  /**
   * Extract recent topics/themes
   * @param {object} $ - Cheerio instance
   * @returns {string[]} - Recent topics
   */
  extractRecentTopics($) {
    const topics = [];
    
    // Article titles, headings
    $('.article-title, .paper-title, h2, h3').each((i, element) => {
      if (i < 5) { // Limit to first 5
        const text = $(element).text().trim();
        if (text && text.length > 10 && text.length < 200) {
          topics.push(text);
        }
      }
    });

    return topics;
  }

  /**
   * Enhance scraped data with known journal information
   * @param {object} scrapedInfo - Scraped information
   * @param {string} url - Journal URL
   * @returns {object} - Enhanced information
   */
  enhanceWithKnownData(scrapedInfo, url) {
    const knownJournals = this.getKnownJournals();
    
    // Find matching journal by URL pattern
    for (const journal of knownJournals) {
      if (url.toLowerCase().includes(journal.urlPattern.toLowerCase())) {
        return {
          ...journal,
          ...scrapedInfo, // Scraped data takes precedence
        };
      }
    }

    return scrapedInfo;
  }

  /**
   * Get known journal database
   * @returns {Array} - Known journals
   */
  getKnownJournals() {
    return [
      {
        urlPattern: 'nature.com',
        name: 'Nature',
        publisher: 'Nature Publishing Group',
        scope: 'Multidisciplinary science journal covering all areas of science and technology',
        guidelines: 'High-impact research with broad significance. Strict formatting requirements.'
      },
      {
        urlPattern: 'ieee.org',
        name: 'IEEE Journals',
        publisher: 'IEEE',
        scope: 'Engineering, computer science, and technology research',
        guidelines: 'Technical rigor, reproducibility, and practical applications required.'
      },
      {
        urlPattern: 'springer.com',
        name: 'Springer Journals',
        publisher: 'Springer',
        scope: 'Academic research across multiple disciplines',
        guidelines: 'Peer-reviewed research with clear methodology and significant contributions.'
      },
      {
        urlPattern: 'elsevier.com',
        name: 'Elsevier Journals',
        publisher: 'Elsevier',
        scope: 'Scientific and technical research publications',
        guidelines: 'Original research with clear impact and rigorous methodology.'
      },
      {
        urlPattern: 'acm.org',
        name: 'ACM Journals',
        publisher: 'Association for Computing Machinery',
        scope: 'Computer science and information technology research',
        guidelines: 'Technical innovation, reproducible results, and clear contributions to computing.'
      }
    ];
  }

  /**
   * Get fallback journal information when scraping fails
   * @param {string} url - Journal URL
   * @returns {object} - Fallback information
   */
  getFallbackJournalInfo(url) {
    return {
      url: url,
      name: this.extractNameFromUrl(url),
      scope: 'Academic research journal - scope could not be determined',
      guidelines: 'Standard academic guidelines apply - original research, proper methodology, clear writing',
      publisher: 'Unknown Publisher',
      scrapedAt: new Date().toISOString(),
      fallback: true
    };
  }

  /**
   * Extract journal name from URL
   * @param {string} url - Journal URL
   * @returns {string} - Extracted name
   */
  extractNameFromUrl(url) {
    try {
      const domain = new URL(url).hostname;
      const parts = domain.split('.');
      
      // Remove common prefixes/suffixes
      const cleanParts = parts.filter(part => 
        !['www', 'com', 'org', 'net', 'edu', 'journal', 'journals'].includes(part.toLowerCase())
      );
      
      if (cleanParts.length > 0) {
        return cleanParts[0].charAt(0).toUpperCase() + cleanParts[0].slice(1) + ' Journal';
      }
      
      return 'Unknown Journal';
    } catch (error) {
      return 'Unknown Journal';
    }
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - Is valid URL
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (error) {
      return false;
    }
  }
}

module.exports = new JournalService();
