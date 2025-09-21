import { ShortUrlRecord, ClickRecord } from '../types';
export declare class DatabaseService {
    private db;
    constructor();
    private initializeTables;
    createShortUrl(shortcode: string, originalUrl: string, expiry: string): Promise<ShortUrlRecord>;
    getShortUrl(shortcode: string): Promise<ShortUrlRecord | null>;
    isShortcodeAvailable(shortcode: string): Promise<boolean>;
    addClick(shortcode: string, referrer?: string, geoLocation?: string): Promise<void>;
    getClickDetails(shortcode: string): Promise<ClickRecord[]>;
    cleanupExpiredUrls(): Promise<number>;
    close(): void;
}
export declare const database: DatabaseService;
//# sourceMappingURL=sqlite.d.ts.map