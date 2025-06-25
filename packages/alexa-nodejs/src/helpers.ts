/**
 * Node.js/TypeScript library for controlling Amazon Alexa devices programmatically.
 * 
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Helper utilities.
 * 
 * Migrated from AlexaPy Python library.
 */

/**
 * Hide/obfuscate email address for privacy
 */
export function hideEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [localPart, domain] = email.split('@');
  const hiddenLocal = localPart.length > 2 
    ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
    : localPart;
  
  return `${hiddenLocal}@${domain}`;
}

/**
 * Hide/obfuscate serial number for privacy
 */
export function hideSerial(serial: string): string {
  if (!serial || serial.length < 4) {
    return serial;
  }
  
  return serial.substring(0, 4) + '*'.repeat(serial.length - 4);
}

/**
 * General obfuscation function
 */
export function obfuscate(text: string, visibleChars: number = 4): string {
  if (!text || text.length <= visibleChars) {
    return text;
  }
  
  return text.substring(0, visibleChars) + '*'.repeat(text.length - visibleChars);
}

/**
 * Decorator-like function to catch all exceptions and log them
 */
export function catchAllExceptions<T extends (...args: unknown[]) => unknown>(
  target: T,
  context?: string
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = target(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          console.error(`Error in ${context || target.name}:`, error);
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Error in ${context || target.name}:`, error);
      throw error;
    }
  }) as T;
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random number within range
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Delete cookie from cookie string
 */
export function deleteCookie(cookieString: string, cookieName: string): string {
  const cookies = cookieString.split(';').map(cookie => cookie.trim());
  const filteredCookies = cookies.filter(cookie => !cookie.startsWith(`${cookieName}=`));
  return filteredCookies.join('; ');
} 