import { Request, Response } from 'express';
export declare class UrlShortenerController {
    /**
     * Create a new short URL
     */
    createShortUrl(req: Request, res: Response): Promise<void>;
    /**
     * Redirect to original URL
     */
    redirectToOriginalUrl(req: Request, res: Response): Promise<void>;
    /**
     * Get statistics for a shortcode
     */
    getStatistics(req: Request, res: Response): Promise<void>;
    /**
     * Health check endpoint
     */
    healthCheck(_req: Request, res: Response): Promise<void>;
}
export declare const urlShortenerController: UrlShortenerController;
//# sourceMappingURL=urlShortenerController.d.ts.map