export interface Config {
  port: number;
  nodeEnv: string;
  logApiUrl: string;
  accessToken: string;
  baseUrl: string;
  databasePath: string;
}

export const config: Config = {
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  logApiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMml0MzA0MUByZ2lwdC5hYy5pbiIsImV4cCI6MTc1ODQ0NjE5MiwiaWF0IjoxNzU4NDQ1MjkyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmE4ZWE3YzQtYzdlMS00YzcwLWE1M2MtYzBlNDE5NWZlNjg3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2Frc2hhbSBnb3lhbCIsInN1YiI6IjY1OTFmZTNhLTllZDUtNGYzYi1hYjJhLWY5Mjk2ZWM3M2U2OCJ9LCJlbWFpbCI6IjIyaXQzMDQxQHJnaXB0LmFjLmluIiwibmFtZSI6InNha3NoYW0gZ295YWwiLCJyb2xsTm8iOiIyMml0MzA0MSIsImFjY2Vzc0NvZGUiOiJhcnpVY0ciLCJjbGllbnRJRCI6IjY1OTFmZTNhLTllZDUtNGYzYi1hYjJhLWY5Mjk2ZWM3M2U2OCIsImNsaWVudFNlY3JldCI6ImNic0tXWVVxSE1XREdxa2QifQ.RDKB7TkcICluNXQOyeqximwRn6Uj3u3SLXnUWp1OLq0',
  baseUrl: process.env['BASE_URL'] || 'http://localhost:3000',
  databasePath: process.env['DATABASE_PATH'] || './database.sqlite',
};
