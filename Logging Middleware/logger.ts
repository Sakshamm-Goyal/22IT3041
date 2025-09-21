import axios, { AxiosResponse } from 'axios';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package = 
  | 'handler' 
  | 'db' 
  | 'service' 
  | 'repository' 
  | 'api' 
  | 'utils'
  | 'controller'
  | 'middleware'
  | 'route'
  | 'config';

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

export class Logger {
  private readonly logApiUrl: string;
  private readonly accessToken: string;

  constructor(logApiUrl: string, accessToken: string) {
    this.logApiUrl = logApiUrl;
    this.accessToken = accessToken;
  }

  /**
   * Main logging method that sends logs to the evaluation API
   */
  async log(stack: Stack, level: Level, packageName: Package, message: string): Promise<void> {
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

      const logData: LogData = {
        stack: stack.toLowerCase() as Stack,
        level: level.toLowerCase() as Level,
        package: packageName.toLowerCase() as Package,
        message,
      };

      const response: AxiosResponse<LogResponse> = await axios.post(
        this.logApiUrl,
        logData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      if (response.status === 200) {
        console.log(`Log sent successfully: ${response.data.logID}`);
      }
    } catch (error) {
      console.error('Failed to send log:', (error as Error).message);
      // Fallback to console logging if API fails
      console.log(
        `[${stack.toUpperCase()}] [${level.toUpperCase()}] [${packageName.toUpperCase()}] ${message}`
      );
    }
  }

  private isValidStack(stack: string): stack is Stack {
    const validStacks: Stack[] = ['backend', 'frontend'];
    return validStacks.includes(stack.toLowerCase() as Stack);
  }

  private isValidLevel(level: string): level is Level {
    const validLevels: Level[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    return validLevels.includes(level.toLowerCase() as Level);
  }

  private isValidPackage(packageName: string, stack: Stack): packageName is Package {
    const backendPackages: Package[] = [
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
    const frontendPackages: Package[] = ['api'];
    const commonPackages: Package[] = ['utils', 'config'];

    const validPackages: Package[] =
      stack === 'backend'
        ? [...backendPackages, ...commonPackages]
        : [...frontendPackages, ...commonPackages];

    return validPackages.includes(packageName.toLowerCase() as Package);
  }

  // Convenience methods for different log levels
  async debug(packageName: Package, message: string): Promise<void> {
    await this.log('backend', 'debug', packageName, message);
  }

  async info(packageName: Package, message: string): Promise<void> {
    await this.log('backend', 'info', packageName, message);
  }

  async warn(packageName: Package, message: string): Promise<void> {
    await this.log('backend', 'warn', packageName, message);
  }

  async error(packageName: Package, message: string): Promise<void> {
    await this.log('backend', 'error', packageName, message);
  }

  async fatal(packageName: Package, message: string): Promise<void> {
    await this.log('backend', 'fatal', packageName, message);
  }
}

// Factory function to create logger instance
export function createLogger(logApiUrl: string, accessToken: string): Logger {
  return new Logger(logApiUrl, accessToken);
}

// Default logger instance with evaluation API configuration
export const logger = new Logger(
  'http://20.244.56.144/evaluation-service/logs',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMml0MzA0MUByZ2lwdC5hYy5pbiIsImV4cCI6MTc1ODQ0NjE5MiwiaWF0IjoxNzU4NDQ1MjkyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmE4ZWE3YzQtYzdlMS00YzcwLWE1M2MtYzBlNDE5NWZlNjg3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2Frc2hhbSBnb3lhbCIsInN1YiI6IjY1OTFmZTNhLTllZDUtNGYzYi1hYjJhLWY5Mjk2ZWM3M2U2OCJ9LCJlbWFpbCI6IjIyaXQzMDQxQHJnaXB0LmFjLmluIiwibmFtZSI6InNha3NoYW0gZ295YWwiLCJyb2xsTm8iOiIyMml0MzA0MSIsImFjY2Vzc0NvZGUiOiJhcnpVY0ciLCJjbGllbnRJRCI6IjY1OTFmZTNhLTllZDUtNGYzYi1hYjJhLWY5Mjk2ZWM3M2U2OCIsImNsaWVudFNlY3JldCI6ImNic0tXWVVxSE1XREdxa2QifQ.RDKB7TkcICluNXQOyeqximwRn6Uj3u3SLXnUWp1OLq0'
);
