import shortid from 'shortid';
import { logger } from '../middleware/logger';
import { database } from '../database/sqlite';
import { config } from '../config';
import { CreateShortUrlRequest, CreateShortUrlResponse, ShortUrlStats, ClickDetail } from '../types';

export class UrlShortenerService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.baseUrl;
  }

  /**
   * Create a new short URL
   */
  async createShortUrl(urlData: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
    try {
      await logger.info('service', `Creating short URL for: ${urlData.url}`);

      // Validate URL
      if (!this.isValidUrl(urlData.url)) {
        await logger.error('service', `Invalid URL provided: ${urlData.url}`);
        throw new Error('Invalid URL format');
      }

      // Generate or validate shortcode
      let shortcode = urlData.shortcode;
      if (shortcode) {
        if (!this.isValidShortcode(shortcode)) {
          await logger.error('service', `Invalid shortcode format: ${shortcode}`);
          throw new Error('Invalid shortcode format. Must be alphanumeric, 4-20 characters');
        }

        const isAvailable = await database.isShortcodeAvailable(shortcode);
        if (!isAvailable) {
          await logger.error('service', `Shortcode already exists: ${shortcode}`);
          throw new Error('Shortcode already exists');
        }
      } else {
        shortcode = await this.generateUniqueShortcode();
        await logger.info('service', `Generated shortcode: ${shortcode}`);
      }

      // Calculate expiry
      const validityMinutes = urlData.validity || 30;
      const expiry = new Date(Date.now() + validityMinutes * 60 * 1000);

      // Create short link
      const shortLink = `${this.baseUrl}/${shortcode}`;

      // Save to database
      await database.createShortUrl(shortcode, urlData.url, expiry.toISOString());

      await logger.info('service', `Short URL created successfully: ${shortLink}`);

      return {
        shortLink,
        expiry: expiry.toISOString(),
      };
    } catch (error) {
      await logger.error('service', `Error creating short URL: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get original URL and track click
   */
  async getOriginalUrl(shortcode: string): Promise<string | null> {
    try {
      await logger.info('service', `Retrieving original URL for shortcode: ${shortcode}`);

      const urlData = await database.getShortUrl(shortcode);

      if (!urlData) {
        await logger.warn('service', `Shortcode not found or expired: ${shortcode}`);
        return null;
      }

      // Track click
      const clickData = {
        referrer: 'direct',
        geoLocation: JSON.stringify({
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
        }),
      };

      await database.addClick(shortcode, clickData.referrer, clickData.geoLocation);

      await logger.info('service', `Redirecting to original URL: ${urlData.originalUrl}`);

      return urlData.originalUrl;
    } catch (error) {
      await logger.error('service', `Error retrieving original URL: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Get statistics for a shortcode
   */
  async getStatistics(shortcode: string): Promise<ShortUrlStats | null> {
    try {
      await logger.info('service', `Retrieving statistics for shortcode: ${shortcode}`);

      const urlData = await database.getShortUrl(shortcode);

      if (!urlData) {
        await logger.warn('service', `Shortcode not found for statistics: ${shortcode}`);
        return null;
      }

      const clickDetails = await database.getClickDetails(shortcode);
      const clicksDetail: ClickDetail[] = clickDetails.map((click) => ({
        timestamp: click.timestamp,
        referrer: click.referrer,
        geoLocation: JSON.parse(click.geoLocation),
      }));

      const statistics: ShortUrlStats = {
        clicks: urlData.clicks,
        originalURL: urlData.originalUrl,
        creationDate: urlData.createdAt,
        expiry: urlData.expiry,
        clicksDetail,
      };

      await logger.info(
        'service',
        `Statistics retrieved for shortcode: ${shortcode}, total clicks: ${urlData.clicks}`
      );

      return statistics;
    } catch (error) {
      await logger.error('service', `Error retrieving statistics: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Generate a unique shortcode
   */
  private async generateUniqueShortcode(): Promise<string> {
    let shortcode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortcode = shortid.generate();
      attempts++;

      if (attempts >= maxAttempts) {
        await logger.error('service', 'Failed to generate unique shortcode after maximum attempts');
        throw new Error('Failed to generate unique shortcode');
      }
    } while (!(await database.isShortcodeAvailable(shortcode)));

    return shortcode;
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  /**
   * Validate shortcode format
   */
  private isValidShortcode(shortcode: string): boolean {
    const regex = /^[a-zA-Z0-9]{4,20}$/;
    return regex.test(shortcode);
  }

  /**
   * Cleanup expired URLs
   */
  async cleanupExpiredUrls(): Promise<void> {
    try {
      await database.cleanupExpiredUrls();
    } catch (error) {
      await logger.error('service', `Cleanup job failed: ${(error as Error).message}`);
    }
  }
}

// Create singleton instance
export const urlShortenerService = new UrlShortenerService();
