"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.DatabaseService = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const config_1 = require("../config");
const logger_1 = require("../middleware/logger");
class DatabaseService {
    constructor() {
        this.db = new sqlite3_1.default.Database(config_1.config.databasePath);
        this.initializeTables();
    }
    initializeTables() {
        try {
            // Create short_urls table
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS short_urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          shortcode TEXT UNIQUE NOT NULL,
          original_url TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expiry DATETIME NOT NULL,
          clicks INTEGER DEFAULT 0
        )
      `);
            // Create clicks table
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS clicks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          shortcode TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          referrer TEXT DEFAULT 'direct',
          geo_location TEXT DEFAULT '{}',
          FOREIGN KEY (shortcode) REFERENCES short_urls (shortcode)
        )
      `);
            // Create indexes
            this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_shortcode ON short_urls(shortcode);
        CREATE INDEX IF NOT EXISTS idx_expiry ON short_urls(expiry);
        CREATE INDEX IF NOT EXISTS idx_clicks_shortcode ON clicks(shortcode);
      `);
            logger_1.logger.info('db', 'Database tables initialized successfully');
        }
        catch (error) {
            logger_1.logger.fatal('db', `Database initialization failed: ${error.message}`);
            throw error;
        }
    }
    async createShortUrl(shortcode, originalUrl, expiry) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT INTO short_urls (shortcode, original_url, expiry)
        VALUES (?, ?, ?)
      `);
            stmt.run([shortcode, originalUrl, expiry], function (err) {
                if (err) {
                    logger_1.logger.error('db', `Error creating short URL: ${err.message}`);
                    reject(err);
                    return;
                }
                logger_1.logger.info('db', `Short URL created: ${shortcode} -> ${originalUrl}`);
                resolve({
                    id: this.lastID,
                    shortcode,
                    originalUrl,
                    createdAt: new Date().toISOString(),
                    expiry,
                    clicks: 0,
                });
            });
            stmt.finalize();
        });
    }
    async getShortUrl(shortcode) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        SELECT * FROM short_urls WHERE shortcode = ? AND expiry > datetime('now')
      `);
            stmt.get([shortcode], (err, row) => {
                if (err) {
                    logger_1.logger.error('db', `Error getting short URL: ${err.message}`);
                    reject(err);
                    return;
                }
                if (!row) {
                    resolve(null);
                    return;
                }
                resolve({
                    id: row.id,
                    shortcode: row.shortcode,
                    originalUrl: row.original_url,
                    createdAt: row.created_at,
                    expiry: row.expiry,
                    clicks: row.clicks,
                });
            });
            stmt.finalize();
        });
    }
    async isShortcodeAvailable(shortcode) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM short_urls WHERE shortcode = ?
      `);
            stmt.get([shortcode], (err, row) => {
                if (err) {
                    logger_1.logger.error('db', `Error checking shortcode availability: ${err.message}`);
                    reject(err);
                    return;
                }
                resolve(row.count === 0);
            });
            stmt.finalize();
        });
    }
    async addClick(shortcode, referrer = 'direct', geoLocation = '{}') {
        return new Promise((resolve, reject) => {
            // Add click record
            const clickStmt = this.db.prepare(`
        INSERT INTO clicks (shortcode, referrer, geo_location)
        VALUES (?, ?, ?)
      `);
            clickStmt.run([shortcode, referrer, geoLocation], (err) => {
                if (err) {
                    logger_1.logger.error('db', `Error adding click: ${err.message}`);
                    reject(err);
                    return;
                }
                // Update click count
                const updateStmt = this.db.prepare(`
          UPDATE short_urls SET clicks = clicks + 1 WHERE shortcode = ?
        `);
                updateStmt.run([shortcode], (updateErr) => {
                    if (updateErr) {
                        logger_1.logger.error('db', `Error updating click count: ${updateErr.message}`);
                        reject(updateErr);
                        return;
                    }
                    logger_1.logger.info('db', `Click recorded for shortcode: ${shortcode}`);
                    resolve();
                });
                updateStmt.finalize();
            });
            clickStmt.finalize();
        });
    }
    async getClickDetails(shortcode) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        SELECT * FROM clicks WHERE shortcode = ? ORDER BY timestamp DESC
      `);
            stmt.all([shortcode], (err, rows) => {
                if (err) {
                    logger_1.logger.error('db', `Error getting click details: ${err.message}`);
                    reject(err);
                    return;
                }
                const clickRecords = rows.map((row) => ({
                    id: row.id,
                    shortcode: row.shortcode,
                    timestamp: row.timestamp,
                    referrer: row.referrer,
                    geoLocation: row.geo_location,
                }));
                resolve(clickRecords);
            });
            stmt.finalize();
        });
    }
    async cleanupExpiredUrls() {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        DELETE FROM short_urls WHERE expiry <= datetime('now')
      `);
            stmt.run((err) => {
                if (err) {
                    logger_1.logger.error('db', `Error cleaning up expired URLs: ${err.message}`);
                    reject(err);
                    return;
                }
                const deletedCount = stmt.changes || 0;
                if (deletedCount > 0) {
                    logger_1.logger.info('db', `Cleaned up ${deletedCount} expired URLs`);
                }
                resolve(deletedCount);
            });
            stmt.finalize();
        });
    }
    close() {
        this.db.close();
    }
}
exports.DatabaseService = DatabaseService;
// Create singleton instance
exports.database = new DatabaseService();
//# sourceMappingURL=sqlite.js.map