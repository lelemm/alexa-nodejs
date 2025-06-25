/**
 * Node.js/TypeScript library for controlling Amazon Alexa devices programmatically.
 * 
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TypeScript interfaces.
 * 
 * Migrated from AlexaPy Python library.
 */

export interface LoginStatus {
  login_successful?: boolean;
  [key: string]: unknown;
}

export interface LoginStats {
  login_timestamp: Date;
  api_calls: number;
  [key: string]: unknown;
}

export interface OAuthTokens {
  access_token?: string;
  refresh_token?: string;
  mac_dms?: string;
  expires_in?: number;
  code_verifier?: string;
  code_challenge?: string;
  authorization_code?: string;
}

export interface AlexaDevice {
  serialNumber: string;
  deviceType: string;
  deviceFamily: string;
  [key: string]: unknown;
}

export interface AlexaSequence {
  [key: string]: unknown;
}

export interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface AuthenticationData {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface DevicePreferences {
  [deviceSerial: string]: unknown;
}

export interface GuardState {
  armState: string;
  [key: string]: unknown;
}

export interface NotificationData {
  message: string;
  title?: string;
  targets?: string[];
  [key: string]: unknown;
}

export interface MediaData {
  provider?: string;
  searchPhrase?: string;
  volume?: number;
  [key: string]: unknown;
} 