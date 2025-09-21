import axios, { AxiosResponse } from 'axios';
import { config } from '../config';
import { LogData, LogResponse, Stack, Level, Package } from '../types';

export class Logger {
  private readonly logApiUrl: string;
  private readonly accessToken: string;

  constructor() {
    this.logApiUrl = config.logApiUrl;
    this.accessToken = config.accessToken;
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

// Create singleton instance
export const logger = new Logger();
