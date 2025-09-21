import { Stack, Level, Package } from '../types';
export declare class Logger {
    private readonly logApiUrl;
    private readonly accessToken;
    constructor();
    /**
     * Main logging method that sends logs to the evaluation API
     */
    log(stack: Stack, level: Level, packageName: Package, message: string): Promise<void>;
    private isValidStack;
    private isValidLevel;
    private isValidPackage;
    debug(packageName: Package, message: string): Promise<void>;
    info(packageName: Package, message: string): Promise<void>;
    warn(packageName: Package, message: string): Promise<void>;
    error(packageName: Package, message: string): Promise<void>;
    fatal(packageName: Package, message: string): Promise<void>;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map