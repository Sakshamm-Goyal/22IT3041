export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package = 'handler' | 'db' | 'service' | 'repository' | 'api' | 'utils' | 'controller' | 'middleware' | 'route' | 'config';
export interface LogData {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
}
export interface LogResponse {
    logID: string;
    message: string;
}
export declare class Logger {
    private readonly logApiUrl;
    private readonly accessToken;
    constructor(logApiUrl: string, accessToken: string);
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
export declare function createLogger(logApiUrl: string, accessToken: string): Logger;
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map