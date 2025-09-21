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

export interface CreateShortUrlRequest {
  url: string;
  validity?: number;
  shortcode?: string;
}

export interface CreateShortUrlResponse {
  shortLink: string;
  expiry: string;
}

export interface ClickDetail {
  timestamp: string;
  referrer: string;
  geoLocation: {
    country: string;
    city: string;
    region: string;
  };
}

export interface ShortUrlStats {
  clicks: number;
  originalURL: string;
  creationDate: string;
  expiry: string;
  clicksDetail: ClickDetail[];
}

export interface ShortUrlRecord {
  id: number;
  shortcode: string;
  originalUrl: string;
  createdAt: string;
  expiry: string;
  clicks: number;
}

export interface ClickRecord {
  id: number;
  shortcode: string;
  timestamp: string;
  referrer: string;
  geoLocation: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}
