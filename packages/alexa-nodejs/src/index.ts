/**
 * Node.js/TypeScript library for controlling Amazon Alexa devices programmatically.
 * 
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Main entry point.
 * 
 * Migrated from AlexaPy Python library.
 */

// Core classes
export { AlexaLogin } from './alexa-login';
export { AlexaAPI } from './alexa-api';

// Error classes
export {
  AlexaNodeJSError,
  AlexaConnectionError,
  AlexaLoginError,
  AlexaTooManyRequestsError,
  AlexaLoginCloseRequestedError,
  AlexaInvalidTOTPKeyError
} from './errors';

// Utility functions
export {
  hideEmail,
  hideSerial,
  obfuscate,
  catchAllExceptions,
  sleep,
  randomBetween,
  deleteCookie
} from './helpers';

// Constants
export {
  CALL_VERSION,
  APP_NAME,
  USER_AGENT,
  LOCALE_KEY,
  HTTP2_NA,
  HTTP2_EU,
  HTTP2_FE,
  HTTP2_AUTHORITY,
  HTTP2_DEFAULT
} from './constants';

// Types and interfaces
export type {
  LoginStatus,
  LoginStats,
  OAuthTokens,
  AlexaDevice,
  AlexaSequence,
  HttpRequestOptions,
  AuthenticationData,
  DevicePreferences,
  GuardState,
  NotificationData,
  MediaData
} from './interfaces';

// Package metadata
export const __version__ = '1.0.0';
export const __author__ = 'Migrated from AlexaPy';
export const __license__ = 'Apache-2.0'; 