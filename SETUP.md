# Setup Guide - URL Shortener Microservice

## Quick Start (Recommended)

### Option 1: Using Docker (Easiest)
```bash
# Start MongoDB and the application
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f app
```

### Option 2: Local Development

#### 1. Install MongoDB
```bash
# On macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# On Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# On Windows
# Download and install from https://www.mongodb.com/try/download/community
```

#### 2. Start the Application
```bash
# Install dependencies
npm install

# Start the application
npm start
# or
./start.sh
```

## Testing the Application

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Create a Short URL
```bash
curl -X POST http://localhost:3000/api/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com/search?q=very+long+search+query",
    "validity": 60,
    "shortcode": "test123"
  }'
```

### 3. Test Redirection
```bash
curl -I http://localhost:3000/test123
```

### 4. Get Statistics
```bash
curl http://localhost:3000/api/shorturls/test123
```

### 5. Run Automated Tests
```bash
# Start the server in one terminal
npm start

# Run tests in another terminal
node test.js
```

## Frontend Testing

1. Open your browser and go to `http://localhost:3000`
2. Use the web interface to:
   - Create short URLs
   - Copy URLs to clipboard
   - View statistics
   - Test the service

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/shorturls` | Create short URL |
| GET | `/api/shorturls/:shortcode` | Get statistics |
| GET | `/:shortcode` | Redirect to original URL |

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# or
ps aux | grep mongod

# Start MongoDB if not running
brew services start mongodb-community
# or
mongod
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### Logging API Issues
- The application will fallback to console logging if the external logging API is unavailable
- Check your internet connection and API credentials

## Environment Variables

Create a `.env` file (optional):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/urlshortener
NODE_ENV=development
BASE_URL=http://localhost:3000
```

## Production Deployment

### Using Docker
```bash
# Build and start
docker-compose up -d

# Scale the application
docker-compose up -d --scale app=3
```

### Manual Deployment
```bash
# Set production environment
export NODE_ENV=production
export MONGODB_URI=your_production_mongodb_uri
export BASE_URL=your_production_domain

# Start the application
npm start
```

## Monitoring

- Health check: `GET /api/health`
- Application logs are sent to the evaluation service
- Database operations are logged
- All API requests are logged

## Support

If you encounter any issues:
1. Check the logs in the terminal
2. Verify MongoDB is running
3. Check network connectivity
4. Review the troubleshooting section above
