import { CreateShortUrlRequest, CreateShortUrlResponse, ShortUrlStats } from '../types';
export declare class UrlShortenerService {
    private readonly baseUrl;
    constructor();
    /**
     * Create a new short URL
     */
    createShortUrl(urlData: CreateShortUrlRequest): Promise<CreateShortUrlResponse>;
    /**
     * Get original URL and track click
     */
    getOriginalUrl(shortcode: string): Promise<string | null>;
    /**
     * Get statistics for a shortcode
     */
    getStatistics(shortcode: string): Promise<ShortUrlStats | null>;
    /**
     * Generate a unique shortcode
     */
    private generateUniqueShortcode;
    /**
     * Validate URL format
     */
    private isValidUrl;
    /**
     * Validate shortcode format
     */
    private isValidShortcode;
    /**
     * Cleanup expired URLs
     */
    cleanupExpiredUrls(): Promise<void>;
}
export declare const urlShortenerService: UrlShortenerService;
//# sourceMappingURL=urlShortenerService.d.ts.map