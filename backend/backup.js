import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, 'backups');
    this.maxBackups = 7; // Keep last 7 backups
  }

  async ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup() {
    try {
      await this.ensureBackupDir();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(
        this.backupDir,
        `database-backup-${timestamp}.sqlite`
      );

      const sourceDb = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database,
      });

      const backupDb = await open({
        filename: backupFile,
        driver: sqlite3.Database,
      });

      // Copy all data from source to backup
      await sourceDb.backup(backupDb);

      await sourceDb.close();
      await backupDb.close();

      console.log(`Backup created: ${backupFile}`);

      // Clean up old backups
      await this.cleanupOldBackups();

      return backupFile;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

  async cleanupOldBackups() {
    try {
      const files = fs
        .readdirSync(this.backupDir)
        .filter(
          (file) =>
            file.startsWith('database-backup-') && file.endsWith('.sqlite')
        )
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // Remove files beyond the maxBackups limit
      for (let i = this.maxBackups; i < files.length; i++) {
        const filePath = path.join(this.backupDir, files[i].name);
        fs.unlinkSync(filePath);
        console.log(`Removed old backup: ${files[i].name}`);
      }
    } catch (error) {
      console.error('Backup cleanup failed:', error);
    }
  }

  async restoreBackup(backupFile) {
    try {
      if (!fs.existsSync(backupFile)) {
        throw new Error(`Backup file not found: ${backupFile}`);
      }

      const backupDb = await open({
        filename: backupFile,
        driver: sqlite3.Database,
      });

      const targetDb = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database,
      });

      // Restore from backup
      await backupDb.backup(targetDb);

      await backupDb.close();
      await targetDb.close();

      console.log(`Database restored from: ${backupFile}`);
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  async listBackups() {
    try {
      await this.ensureBackupDir();

      const files = fs
        .readdirSync(this.backupDir)
        .filter(
          (file) =>
            file.startsWith('database-backup-') && file.endsWith('.sqlite')
        )
        .map((file) => ({
          name: file,
          path: path.join(this.backupDir, file),
          size: fs.statSync(path.join(this.backupDir, file)).size,
          modified: fs.statSync(path.join(this.backupDir, file)).mtime,
        }))
        .sort((a, b) => b.modified - a.modified);

      return files;
    } catch (error) {
      console.error('List backups failed:', error);
      return [];
    }
  }
}

// CLI interface
if (process.argv[2] === 'create') {
  const backup = new DatabaseBackup();
  backup
    .createBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (process.argv[2] === 'list') {
  const backup = new DatabaseBackup();
  backup
    .listBackups()
    .then((files) => {
      console.log('Available backups:');
      files.forEach((file) => {
        console.log(
          `- ${file.name} (${(file.size / 1024).toFixed(
            2
          )} KB, ${file.modified.toISOString()})`
        );
      });
      process.exit(0);
    })
    .catch(() => process.exit(1));
} else if (process.argv[2] === 'restore' && process.argv[3]) {
  const backup = new DatabaseBackup();
  backup
    .restoreBackup(process.argv[3])
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  console.log(`
Database Backup Utility

Usage:
  node backup.js create    - Create a new backup
  node backup.js list      - List available backups
  node backup.js restore <file> - Restore from backup file

Examples:
  node backup.js create
  node backup.js list
  node backup.js restore ./backups/database-backup-2024-01-05T17-59-02Z.sqlite
  `);
  process.exit(1);
}

export default DatabaseBackup;
