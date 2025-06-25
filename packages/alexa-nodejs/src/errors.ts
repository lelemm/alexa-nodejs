/**
 * Node.js/TypeScript library for controlling Amazon Alexa devices programmatically.
 * 
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Package errors.
 * 
 * Migrated from AlexaPy Python library.
 */

/**
 * Base error class for AlexaNodeJS
 */
export class AlexaNodeJSError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AlexaNodeJSError';
  }
}

/**
 * Error related to invalid requests or connection issues
 */
export class AlexaConnectionError extends AlexaNodeJSError {
  constructor(message?: string) {
    super(message);
    this.name = 'AlexaConnectionError';
  }
}

/**
 * Error related to no longer being logged in
 */
export class AlexaLoginError extends AlexaNodeJSError {
  constructor(message?: string) {
    super(message);
    this.name = 'AlexaLoginError';
  }
}

/**
 * Error related to too many requests
 */
export class AlexaTooManyRequestsError extends AlexaNodeJSError {
  constructor(message?: string) {
    super(message);
    this.name = 'AlexaTooManyRequestsError';
  }
}

/**
 * Error related to requesting access to API after requested close
 */
export class AlexaLoginCloseRequestedError extends AlexaNodeJSError {
  constructor(message?: string) {
    super(message);
    this.name = 'AlexaLoginCloseRequestedError';
  }
}

/**
 * Error related to invalid 2FA key
 */
export class AlexaInvalidTOTPKeyError extends AlexaNodeJSError {
  constructor(message?: string) {
    super(message);
    this.name = 'AlexaInvalidTOTPKeyError';
  }
} 