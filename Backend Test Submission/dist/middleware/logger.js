"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
class Logger {
    constructor() {
        this.logApiUrl = config_1.config.logApiUrl;
        this.accessToken = config_1.config.accessToken;
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
// Create singleton instance
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map