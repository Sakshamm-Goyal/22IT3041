"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
exports.createLogger = createLogger;
const axios_1 = __importDefault(require("axios"));
class Logger {
    constructor(logApiUrl, accessToken) {
        this.logApiUrl = logApiUrl;
        this.accessToken = accessToken;
    }
    /**
     * Main logging method that sends logs to the evaluation API
     */
    async log(stack, level, packageName, message) {
        try {
            // Validate input parameters
            if (!this.isValidStack(stack)) {
                console.error('Invalid stack:', stack);
                return;
            }
            if (!this.isValidLevel(level)) {
                console.error('Invalid level:', level);
                return;
            }
            if (!this.isValidPackage(packageName, stack)) {
                console.error('Invalid package:', packageName, 'for stack:', stack);
                return;
            }
            const logData = {
                stack: stack.toLowerCase(),
                level: level.toLowerCase(),
                package: packageName.toLowerCase(),
                message,
            };
            const response = await axios_1.default.post(this.logApiUrl, logData, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                timeout: 5000,
            });
            if (response.status === 200) {
                console.log(`Log sent successfully: ${response.data.logID}`);
            }
        }
        catch (error) {
            console.error('Failed to send log:', error.message);
            // Fallback to console logging if API fails
            console.log(`[${stack.toUpperCase()}] [${level.toUpperCase()}] [${packageName.toUpperCase()}] ${message}`);
        }
    }
    isValidStack(stack) {
        const validStacks = ['backend', 'frontend'];
        return validStacks.includes(stack.toLowerCase());
    }
    isValidLevel(level) {
        const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
        return validLevels.includes(level.toLowerCase());
    }
    isValidPackage(packageName, stack) {
        const backendPackages = [
            'handler',
            'db',
            'service',
            'repository',
            'controller',
            'middleware',
            'route',
            'utils',
            'config',
        ];
        const frontendPackages = ['api'];
        const commonPackages = ['utils', 'config'];
        const validPackages = stack === 'backend'
            ? [...backendPackages, ...commonPackages]
            : [...frontendPackages, ...commonPackages];
        return validPackages.includes(packageName.toLowerCase());
    }
    // Convenience methods for different log levels
    async debug(packageName, message) {
        await this.log('backend', 'debug', packageName, message);
    }
    async info(packageName, message) {
        await this.log('backend', 'info', packageName, message);
    }
    async warn(packageName, message) {
        await this.log('backend', 'warn', packageName, message);
    }
    async error(packageName, message) {
        await this.log('backend', 'error', packageName, message);
    }
    async fatal(packageName, message) {
        await this.log('backend', 'fatal', packageName, message);
    }
}
exports.Logger = Logger;
// Factory function to create logger instance
function createLogger(logApiUrl, accessToken) {
    return new Logger(logApiUrl, accessToken);
}
// Default logger instance with evaluation API configuration
exports.logger = new Logger('http://20.244.56.144/evaluation-service/logs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMml0MzA0MUByZ2lwdC5hYy5pbiIsImV4cCI6MTc1ODQ0NjE5MiwiaWF0IjoxNzU4NDQ1MjkyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmE4ZWE3YzQtYzdlMS00YzcwLWE1M2MtYzBlNDE5NWZlNjg3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2Frc2hhbSBnb3lhbCIsInN1YiI6IjY1OTFmZTNhLTllZDUtNGYzYi1hYjJhLWY5Mjk2ZWM3M2U2OCJ9LCJlbWFpbCI6IjIyaXQzMDQxQHJnaXB0LmFjLmluIiwibmFtZSI6InNha3NoYW0gZ295YWwiLCJyb2xsTm8iOiIyMml0MzA0MSIsImFjY2Vzc0NvZGUiOiJhcnpVY0ciLCJjbGllbnRJRCI6IjY1OTFmZTNhLTllZDUtNGYzYi1hYjJhLWY5Mjk2ZWM3M2U2OCIsImNsaWVudFNlY3JldCI6ImNic0tXWVVxSE1XREdxa2QifQ.RDKB7TkcICluNXQOyeqximwRn6Uj3u3SLXnUWp1OLq0');
//# sourceMappingURL=logger.js.map