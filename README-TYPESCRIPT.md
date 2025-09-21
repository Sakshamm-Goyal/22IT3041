# URL Shortener Microservice - TypeScript Version

A production-grade TypeScript URL Shortener Microservice built for AFFORDMED evaluation, featuring comprehensive logging, analytics, and a modern frontend interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the application
npm start

# Or run in development mode
npm run dev
```

### Development Commands

```bash
# Build TypeScript
npm run build

# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Clean build directory
npm run clean
```

## 🏗️ Architecture

```
src/
├── config/           # Configuration management
├── controllers/      # API controllers
├── database/         # Database layer (SQLite)
├── middleware/       # Express middleware
├── routes/           # API routes
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── tests/            # Test files
├── public/           # Frontend static files
└── server.ts         # Main server file
```

## 📊 API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/shorturls` | Create short URL | ✅ |
| GET | `/api/shorturls/:shortcode` | Get statistics | ✅ |
| GET | `/:shortcode` | Redirect to original URL | ✅ |
| GET | `/api/health` | Health check | ✅ |

## 🔧 Features

### ✅ **TypeScript Implementation**
- Full TypeScript with strict type checking
- Proper type definitions for all interfaces
- ESLint + Prettier configuration
- Production-ready build process

### ✅ **Logging Middleware**
- Custom logging with evaluation API integration
- Supports all required log levels: debug, info, warn, error, fatal
- Proper validation of stack, level, and package parameters
- Fallback to console logging if API fails

### ✅ **Database Layer**
- SQLite with better-sqlite3 for performance
- Proper schema with indexes and foreign keys
- TTL support for automatic cleanup
- Click tracking with detailed analytics

### ✅ **API Features**
- URL validation and shortcode generation
- Custom shortcode support with validation
- Automatic shortcode generation using shortid
- Expiration handling (default 30 minutes)
- Click tracking and analytics
- Rate limiting and security

### ✅ **Error Handling**
- Comprehensive error handling with proper HTTP status codes
- Descriptive error messages
- Type-safe error responses
- Global error handling middleware

### ✅ **Testing**
- Jest test suite with TypeScript support
- API endpoint testing
- Mock implementations for external dependencies
- Coverage reporting

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
The test suite covers:
- API endpoint functionality
- Error handling scenarios
- Validation middleware
- Service layer logic

## 📝 Logging Integration

The application integrates with the evaluation logging API:
- **Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **Authentication**: Bearer token
- **Log Levels**: debug, info, warn, error, fatal
- **Packages**: handler, db, service, repository, api, utils, etc.
- **Fallback**: Console logging if API unavailable

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi-based request validation
- **SQL Injection Protection**: Parameterized queries
- **Error Boundary**: Global error handling

## 📁 Database Schema

### short_urls Table
```sql
CREATE TABLE short_urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortcode TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiry DATETIME NOT NULL,
  clicks INTEGER DEFAULT 0
);
```

### clicks Table
```sql
CREATE TABLE clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortcode TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  referrer TEXT DEFAULT 'direct',
  geo_location TEXT DEFAULT '{}',
  FOREIGN KEY (shortcode) REFERENCES short_urls (shortcode)
);
```

## 🎯 Requirements Compliance

- ✅ **TypeScript**: Full TypeScript implementation
- ✅ **Logging**: Custom middleware with API integration
- ✅ **Authentication**: Pre-authorized APIs (no login required)
- ✅ **URL Shortening**: Complete functionality
- ✅ **Statistics**: Click tracking and analytics
- ✅ **Error Handling**: Proper HTTP status codes
- ✅ **Database**: SQLite with proper schema
- ✅ **Testing**: Jest test suite
- ✅ **Documentation**: Complete API documentation

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
PORT=3000
NODE_ENV=production
BASE_URL=http://localhost:3000
DATABASE_PATH=./database.sqlite
```

## 📋 API Examples

### Create Short URL
```bash
curl -X POST http://localhost:3000/api/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com",
    "validity": 60,
    "shortcode": "test123"
  }'
```

### Get Statistics
```bash
curl http://localhost:3000/api/shorturls/test123
```

### Test Redirection
```bash
curl -I http://localhost:3000/test123
```

## 🏆 Key Features

1. **Production-Ready TypeScript**: Strict type checking and modern ES features
2. **Comprehensive Logging**: Full integration with evaluation API
3. **Robust Database**: SQLite with proper indexing and relationships
4. **Security**: Rate limiting, validation, and error handling
5. **Testing**: Complete test suite with coverage
6. **Documentation**: API collection and comprehensive docs
7. **Performance**: Optimized queries and efficient data structures

## 👨‍💻 Developer Information

- **Name**: Saksham Goyal
- **Email**: 22it3041@rgipt.ac.in
- **Roll No**: 22it3041
- **Access Code**: arzUcG

---

**Status**: ✅ **COMPLETE** - Production-ready TypeScript microservice ready for evaluation.
