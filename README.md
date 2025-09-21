# URL Shortener Microservice

A robust HTTP URL Shortener Microservice with comprehensive logging, analytics, and a minimal frontend interface.

## Features

- ✅ **URL Shortening**: Create short URLs with custom or auto-generated shortcodes
- ✅ **Redirection**: Automatic redirection to original URLs
- ✅ **Analytics**: Track clicks, referrers, and geographical data
- ✅ **Custom Shortcodes**: User-defined shortcodes (4-20 alphanumeric characters)
- ✅ **Expiration**: Configurable validity periods (default: 30 minutes)
- ✅ **Logging**: Comprehensive logging using custom middleware
- ✅ **Statistics**: Detailed click statistics and analytics
- ✅ **Frontend**: Minimal web interface for easy testing
- ✅ **Error Handling**: Robust error handling with descriptive messages
- ✅ **Rate Limiting**: Built-in rate limiting for API protection

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Logging**: Custom logging middleware with external API integration
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Validation**: Joi for request validation
- **Security**: Helmet, CORS, Rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-med
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `config.js` with your MongoDB connection string
   - Ensure the logging API credentials are correct

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### 1. Create Short URL
- **Method**: POST
- **URL**: `/api/shorturls`
- **Body**:
  ```json
  {
    "url": "https://example.com/very-long-url",
    "validity": 30,
    "shortcode": "mycode"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "shortLink": "http://localhost:3000/mycode",
      "expiry": "2025-01-01T00:30:00Z"
    }
  }
  ```

### 2. Redirect to Original URL
- **Method**: GET
- **URL**: `/{shortcode}`
- **Response**: 302 Redirect to original URL

### 3. Get Statistics
- **Method**: GET
- **URL**: `/api/shorturls/{shortcode}`
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "shortcode": "mycode",
      "originalUrl": "https://example.com/very-long-url",
      "shortLink": "http://localhost:3000/mycode",
      "createdAt": "2025-01-01T00:00:00Z",
      "expiry": "2025-01-01T00:30:00Z",
      "totalClicks": 5,
      "isActive": true,
      "clicks": [
        {
          "timestamp": "2025-01-01T00:05:00Z",
          "referrer": "direct",
          "userAgent": "Mozilla/5.0...",
          "ipAddress": "192.168.1.1",
          "location": {
            "country": "India",
            "city": "Mumbai",
            "region": "Maharashtra"
          }
        }
      ]
    }
  }
  ```

### 4. Health Check
- **Method**: GET
- **URL**: `/api/health`
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "URL Shortener Service is healthy",
    "timestamp": "2025-01-01T00:00:00Z",
    "uptime": 3600
  }
  ```

## Frontend

Access the web interface at `http://localhost:3000` to:
- Create short URLs with a user-friendly form
- Copy short URLs to clipboard
- View statistics for created URLs
- Test the service functionality

## Logging

The application uses a custom logging middleware that integrates with the evaluation service:

- **Log API**: `http://20.244.56.144/evaluation-service/logs`
- **Authentication**: Bearer token authentication
- **Log Levels**: debug, info, warn, error, fatal
- **Packages**: Various backend packages (controller, service, db, etc.)

## Error Handling

The service provides comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Shortcode not found or expired
- **409 Conflict**: Shortcode already exists
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side errors

## Database Schema

### UrlShortener Collection
```javascript
{
  shortcode: String (unique, indexed),
  originalUrl: String (required),
  shortLink: String (required),
  expiry: Date (indexed with TTL),
  createdAt: Date,
  clicks: [ClickSchema],
  totalClicks: Number,
  isActive: Boolean
}
```

### Click Schema
```javascript
{
  timestamp: Date,
  referrer: String,
  userAgent: String,
  ipAddress: String,
  location: {
    country: String,
    city: String,
    region: String
  }
}
```

## Configuration

Update `config.js` to modify:
- MongoDB connection string
- Server port
- Logging API URL and credentials
- Base URL for short links

## Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Update base URL for short links
4. Ensure logging API credentials are correct
5. Start with `npm start`

## License

MIT License - Developed for AFFORDMED evaluation

## Contact

- **Name**: Saksham Goyal
- **Email**: 22it3041@rgipt.ac.in
- **Roll No**: 22it3041
