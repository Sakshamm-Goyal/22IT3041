# Logging Middleware

A reusable TypeScript logging middleware for the AFFORDMED evaluation that integrates with the evaluation service API.

## Features

- ✅ **API Integration**: Sends logs to `http://20.244.56.144/evaluation-service/logs`
- ✅ **Type Safety**: Full TypeScript implementation with strict type checking
- ✅ **Validation**: Validates stack, level, and package parameters
- ✅ **Fallback**: Console logging if API fails
- ✅ **Convenience Methods**: Easy-to-use methods for different log levels
- ✅ **Bearer Token Auth**: Integrated authentication with provided token

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

```typescript
import { logger } from './logger';

// Log with specific parameters
await logger.log('backend', 'info', 'service', 'User created successfully');

// Use convenience methods
await logger.info('service', 'Processing request');
await logger.error('db', 'Database connection failed');
await logger.warn('middleware', 'Rate limit exceeded');
```

### Custom Logger Instance

```typescript
import { createLogger } from './logger';

const customLogger = createLogger(
  'http://your-api.com/logs',
  'your-access-token'
);

await customLogger.info('service', 'Custom log message');
```

## API Reference

### Log Levels
- `debug`: Debug information
- `info`: General information
- `warn`: Warning messages
- `error`: Error messages
- `fatal`: Fatal errors

### Stacks
- `backend`: Backend application logs
- `frontend`: Frontend application logs

### Packages
- `handler`: Request handlers
- `db`: Database operations
- `service`: Business logic
- `repository`: Data access layer
- `api`: API endpoints
- `utils`: Utility functions
- `controller`: Controllers
- `middleware`: Middleware functions
- `route`: Route handlers
- `config`: Configuration

## Configuration

The logger is pre-configured with:
- **API URL**: `http://20.244.56.144/evaluation-service/logs`
- **Access Token**: Provided Bearer token for authentication
- **Timeout**: 5 seconds for API requests
- **Fallback**: Console logging on API failure

## Error Handling

The logger includes comprehensive error handling:
- Validates all input parameters
- Handles API failures gracefully
- Falls back to console logging
- Provides detailed error messages

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development
npm run dev

# Run tests
npm test
```

## Integration Example

```typescript
import { logger } from './logger';

class UserService {
  async createUser(userData: any) {
    try {
      await logger.info('service', 'Creating new user');
      
      // Business logic here
      const user = await this.saveUser(userData);
      
      await logger.info('service', `User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      await logger.error('service', `Failed to create user: ${error.message}`);
      throw error;
    }
  }
}
```

## License

MIT License - Developed for AFFORDMED evaluation

## Author

- **Name**: Saksham Goyal
- **Email**: 22it3041@rgipt.ac.in
- **Roll No**: 22it3041
