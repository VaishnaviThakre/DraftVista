const fs = require('fs-extra');
const path = require('path');

class CleanupService {
  /**
   * Delete a single file safely
   * @param {string} filePath - Path to file to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(filePath) {
    try {
      if (!filePath) {
        return false;
      }

      const exists = await fs.pathExists(filePath);
      if (!exists) {
        console.log(`📁 File already deleted or doesn't exist: ${filePath}`);
        return true;
      }

      await fs.remove(filePath);
      console.log(`🗑️ Successfully deleted file: ${path.basename(filePath)}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to delete file ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Delete multiple files
   * @param {string[]} filePaths - Array of file paths to delete
   * @returns {Promise<object>} - Deletion results
   */
  async deleteFiles(filePaths) {
    const results = {
      deleted: [],
      failed: [],
      total: filePaths.length
    };

    for (const filePath of filePaths) {
      const success = await this.deleteFile(filePath);
      if (success) {
        results.deleted.push(filePath);
      } else {
        results.failed.push(filePath);
      }
    }

    return results;
  }

  /**
   * Clean up old files in uploads directory
   * @param {number} maxAgeHours - Maximum age in hours (default: 24)
   * @returns {Promise<object>} - Cleanup results
   */
  async cleanupOldFiles(maxAgeHours = 24) {
    try {
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
      const now = Date.now();

      const exists = await fs.pathExists(uploadsDir);
      if (!exists) {
        console.log('📁 Uploads directory does not exist');
        return { deleted: [], failed: [], total: 0 };
      }

      const files = await fs.readdir(uploadsDir);
      const oldFiles = [];

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile() && (now - stats.mtime.getTime()) > maxAge) {
          oldFiles.push(filePath);
        }
      }

      if (oldFiles.length === 0) {
        console.log('🧹 No old files to clean up');
        return { deleted: [], failed: [], total: 0 };
      }

      console.log(`🧹 Cleaning up ${oldFiles.length} old files...`);
      return await this.deleteFiles(oldFiles);
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      return { deleted: [], failed: [], total: 0, error: error.message };
    }
  }

  /**
   * Get upload directory info
   * @returns {Promise<object>} - Directory information
   */
  async getUploadDirInfo() {
    try {
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      const exists = await fs.pathExists(uploadsDir);
      
      if (!exists) {
        return {
          exists: false,
          path: uploadsDir,
          files: 0,
          totalSize: 0
        };
      }

      const files = await fs.readdir(uploadsDir);
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      }

      return {
        exists: true,
        path: uploadsDir,
        files: files.length,
        totalSize: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
      
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }

  /**
   * Ensure uploads directory exists and is writable
   * @returns {Promise<boolean>} - Success status
   */
  async ensureUploadsDir() {
    try {
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      await fs.ensureDir(uploadsDir);
      
      // Test write access
      const testFile = path.join(uploadsDir, '.write-test');
      await fs.writeFile(testFile, 'test');
      await fs.remove(testFile);
      
      console.log('📁 Uploads directory ready:', uploadsDir);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to ensure uploads directory:', error.message);
      return false;
    }
  }

  /**
   * Schedule automatic cleanup
   * @param {number} intervalHours - Cleanup interval in hours
   * @param {number} maxAgeHours - Maximum file age in hours
   */
  scheduleCleanup(intervalHours = 6, maxAgeHours = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    console.log(`🕐 Scheduling automatic cleanup every ${intervalHours} hours`);
    
    setInterval(async () => {
      console.log('🧹 Running scheduled cleanup...');
      const results = await this.cleanupOldFiles(maxAgeHours);
      
      if (results.deleted.length > 0) {
        console.log(`✅ Cleaned up ${results.deleted.length} old files`);
      }
      
      if (results.failed.length > 0) {
        console.log(`⚠️ Failed to delete ${results.failed.length} files`);
      }
    }, intervalMs);
  }
}

module.exports = new CleanupService();
