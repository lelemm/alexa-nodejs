/**
 * Node.js/TypeScript library for controlling Amazon Alexa devices programmatically.
 * 
 * SPDX-License-Identifier: Apache-2.0
 * 
 * API access.
 * 
 * Migrated from AlexaPy Python library.
 */

import axios, { AxiosResponse, AxiosError } from 'axios';
import { AlexaLogin } from './alexa-login';
import { 
  AlexaLoginError, 
  AlexaTooManyRequestsError,
  AlexaLoginCloseRequestedError 
} from './errors';
import { hideEmail, sleep, randomBetween } from './helpers';
import type { AlexaDevice } from './interfaces';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export class AlexaAPI {
  private device: AlexaDevice;
  private login: AlexaLogin;
  private session: typeof axios;
  private url: string;
  private static devices: Record<string, unknown> = {};
  private static wakeWords: Record<string, unknown> = {};
  private static sequenceQueue: Record<string, Array<Record<string, unknown>>> = {};
  private static sequenceLock: Record<string, boolean> = {};

  constructor(device: AlexaDevice, login: AlexaLogin) {
    this.device = device;
    this.login = login;
    this.session = axios;
    this.url = `https://alexa.${login.url}`;
    
<<<<<<< HEAD
    // Set referer header for API calls
    this.login.headers['Referer'] = `${this.url}/spa/index.html`;
    
=======
>>>>>>> origin/main
    // Initialize static properties for this login
    if (!AlexaAPI.sequenceQueue[login.email]) {
      AlexaAPI.sequenceQueue[login.email] = [];
      AlexaAPI.sequenceLock[login.email] = false;
    }
<<<<<<< HEAD
    
    // Try to get CSRF token from cookies and add to headers
    try {
      const cookieHeader = this.login.session.defaults.headers?.common?.Cookie as string;
      if (cookieHeader) {
        const csrfMatch = cookieHeader.match(/csrf=([^;]+)/);
        if (csrfMatch) {
          this.login.headers['csrf'] = csrfMatch[1];
        }
      }
    } catch (error) {
      console.log('Could not extract CSRF from cookies on init:', error);
    }
  }

  public updateLogin(login: AlexaLogin): boolean {
    if (login !== this.login || login.session !== this.login.session) {
      console.log(`${hideEmail(login.email)}: New Login ${login} detected; replacing ${this.login}`);
      this.login = login;
      this.url = `https://alexa.${login.url}`;
      this.login.headers['Referer'] = `${this.url}/spa/index.html`;
      
      // Try to get CSRF token from cookies and add to headers
      try {
        const cookieHeader = this.login.session.defaults.headers?.common?.Cookie as string;
        if (cookieHeader) {
          const csrfMatch = cookieHeader.match(/csrf=([^;]+)/);
          if (csrfMatch) {
            this.login.headers['csrf'] = csrfMatch[1];
          }
        }
      } catch (error) {
        if (login.status.login_successful) {
          console.log('Could not extract CSRF from cookies on update:', error);
        }
      }
      
=======
  }

  public updateLogin(login: AlexaLogin): boolean {
    if (login !== this.login) {
      console.log(`${hideEmail(login.email)}: New Login ${login} detected; replacing ${this.login}`);
      this.login = login;
      this.url = `https://alexa.${login.url}`;
>>>>>>> origin/main
      return true;
    }
    return false;
  }

  private async processResponse(response: AxiosResponse, login: AlexaLogin): Promise<AxiosResponse | null> {
    login.stats.api_calls += 1;
    console.log(`api_calls: ${login.stats.api_calls}`);
    
    if (response.status === 401) {
      login.status.login_successful = false;
      throw new AlexaLoginError(response.statusText);
    }
    
    if (response.status === 429) {
      throw new AlexaTooManyRequestsError(response.statusText);
    }
    
    if (response.status >= 400) {
      console.log(`Returning null due to status: ${response.status}`);
      return null;
    }
    
    return response;
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    config: RetryConfig = { maxRetries: 10, baseDelay: 500, maxDelay: 90000 }
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt < config.maxRetries) {
      try {
        return await requestFn();
      } catch (error) {
        const axiosError = error as AxiosError;
        
        if (
          axiosError.code === 'ECONNRESET' ||
          axiosError.response?.status === 429 ||
          axiosError.code === 'ETIMEDOUT'
        ) {
          attempt++;
          
          if (attempt >= config.maxRetries) {
            throw error;
          }
          
          const delay = Math.min(
            config.baseDelay * Math.pow(2, attempt) + randomBetween(0, 1000),
            config.maxDelay
          );
          
          console.log(`Retry attempt ${attempt} after ${delay}ms`);
          await sleep(delay);
        } else {
          throw error;
        }
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  private async request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    uri: string,
    data?: unknown,
    query?: Record<string, string>
  ): Promise<AxiosResponse> {
    if (this.login.closeRequestedStatus) {
      throw new AlexaLoginCloseRequestedError('Login close requested');
    }

    // Handle token refresh if needed
    if (this.login.expiresIn && (this.login.expiresIn - Date.now() / 1000 < 0)) {
      console.log(`${hideEmail(this.login.email)}: Detected access token expiration; refreshing`);
      
      if (!(await this.login.refreshAccessToken()) || 
          !(await this.login.exchangeTokenForCookies()) ||
          !(await this.login.getCsrf())) {
        console.log(`${hideEmail(this.login.email)}: Unable to refresh oauth`);
        this.login.accessToken = undefined;
        this.login.refreshToken = undefined;
        this.login.expiresIn = undefined;
<<<<<<< HEAD
      } else {
        await this.login.finalizeLogin();
=======
>>>>>>> origin/main
      }
    }

    const url = `${this.url}${uri}`;
    const params = method === 'GET' ? { 
      ...query, 
      _: Math.floor(Date.now()) 
    } : query;

    console.log(`${hideEmail(this.login.email)}: Trying ${method}: ${url} with data:`, data, 'query:', params);

<<<<<<< HEAD
    if (!this.login.status.login_successful) {
      console.log(`${hideEmail(this.login.email)}: Login error detected; ignoring ${method} request to ${uri}`);
      throw new AlexaLoginError('Login error detected; not contacting API');
    }

    return this.retryRequest(async () => {
      const response = await this.login.session({
        method,
        url,
        data: method === 'GET' ? undefined : data,
        params,
        timeout: 30000,
        headers: {
          ...this.login.headers,
=======
    return this.retryRequest(async () => {
      const response = await this.session({
        method,
        url,
        data,
        params,
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
>>>>>>> origin/main
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        withCredentials: true,
      });

<<<<<<< HEAD
      console.log(`${hideEmail(this.login.email)}: ${method}: ${url} returned ${response.status}:${response.statusText}:${response.headers['content-type']}`);

=======
>>>>>>> origin/main
      return await this.processResponse(response, this.login) || response;
    });
  }

  private async postRequest(uri: string, data?: unknown, query?: Record<string, string>): Promise<AxiosResponse> {
    return this.request('POST', uri, data, query);
  }

  private async getRequest(uri: string, data?: unknown, query?: Record<string, string>): Promise<AxiosResponse> {
    return this.request('GET', uri, data, query);
  }

  private async putRequest(uri: string, data?: unknown, query?: Record<string, string>): Promise<AxiosResponse> {
    return this.request('PUT', uri, data, query);
  }

  private async deleteRequest(uri: string, data?: unknown, query?: Record<string, string>): Promise<AxiosResponse> {
    return this.request('DELETE', uri, data, query);
  }

<<<<<<< HEAD
  public static async staticRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    login: AlexaLogin,
    uri: string,
    data?: unknown,
    query?: Record<string, string>,
    subdomain = 'alexa'
  ): Promise<AxiosResponse | null> {
    // Handle token refresh if needed
    if (login.expiresIn && (login.expiresIn - Date.now() / 1000 < 0)) {
      console.log(`${hideEmail(login.email)}: Detected access token expiration; refreshing`);
      
      if (!(await login.refreshAccessToken()) || 
          !(await login.exchangeTokenForCookies()) ||
          !(await login.getCsrf())) {
        console.log(`${hideEmail(login.email)}: Unable to refresh oauth`);
        login.accessToken = undefined;
        login.refreshToken = undefined;
        login.expiresIn = undefined;
      } else {
        await login.finalizeLogin();
      }
    }

    const url = `https://${subdomain}.${login.url}${uri}`;
    const params = query;

    console.log(`${hideEmail(login.email)}: Static ${method}: ${url}`);

    if (login.closeRequestedStatus) {
      console.log(`${hideEmail(login.email)}: Login object has been asked to close; ignoring ${method} request`);
      throw new AlexaLoginCloseRequestedError();
    }

    if (!login.status.login_successful) {
      console.log(`${hideEmail(login.email)}: Login error detected; ignoring ${method} request`);
      throw new AlexaLoginError('Login error detected; not contacting API');
    }

    try {
      const response = await login.session({
        method,
        url,
        data: method === 'GET' ? undefined : data,
        params,
        timeout: 30000,
        headers: {
          ...login.headers,
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        withCredentials: true,
      });

      console.log(`${hideEmail(login.email)}: static ${method}: ${url} returned ${response.status}:${response.statusText}:${response.headers['content-type']}`);

      if (response.status === 401) {
        if (await login.testLoggedIn()) {
          // Retry once if we can still login
          const retryResponse = await login.session({
            method,
            url,
            data: method === 'GET' ? undefined : data,
            params,
            timeout: 30000,
            headers: {
              ...login.headers,
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            withCredentials: true,
          });
          
          console.log(`Error 401, retried once request: ${hideEmail(login.email)}: static ${method}: ${url} returned ${retryResponse.status}:${retryResponse.statusText}`);
          return await AlexaAPI.processStaticResponse(retryResponse, login);
        }
      }

      return await AlexaAPI.processStaticResponse(response, login);
    } catch (error) {
      console.error(`${hideEmail(login.email)}: Static request error:`, error);
      return null;
    }
  }

  private static async processStaticResponse(response: AxiosResponse, login: AlexaLogin): Promise<AxiosResponse | null> {
    login.stats.api_calls += 1;
    console.log(`api_calls: ${login.stats.api_calls}`);
    
    if (response.status === 401) {
      login.status.login_successful = false;
      throw new AlexaLoginError(response.statusText);
    }
    
    if (response.status === 429) {
      throw new AlexaTooManyRequestsError(response.statusText);
    }
    
    if (response.status >= 400) {
      console.log(`Returning null due to status: ${response.status}`);
      return null;
    }
    
    return response;
  }

=======
>>>>>>> origin/main
  // Main API methods

  public async sendSequence(
    sequence: string,
    customerId?: string,
    queueDelay = 1.5,
    extra?: Record<string, unknown>
  ): Promise<void> {
    try {
      console.log(`${hideEmail(this.login.email)}: Sending sequence: ${sequence}`);
      
      const data = {
        behaviorId: sequence,
        sequenceJson: JSON.stringify({
          '@type': 'com.amazon.alexa.behaviors.model.Sequence',
          'startNode': {
            '@type': 'com.amazon.alexa.behaviors.model.OpaquePayloadOperationNode',
            'type': 'Alexa.DeviceControls.RemoteControlOperation',
            'operationPayload': {
              'customerId': customerId || this.login.customerId,
              'deviceType': this.device.deviceType,
              'deviceSerialNumber': this.device.serialNumber,
              'command': sequence,
              ...extra
            }
          }
        }),
        status: 'ENABLED'
      };

      await this.postRequest('/api/behaviors/preview', data);
      
      if (queueDelay > 0) {
        await sleep(queueDelay * 1000);
      }
    } catch (error) {
      console.error(`Error sending sequence: ${error}`);
      throw error;
    }
  }

  public async sendTTS(
    message: string,
    customerId?: string,
    targets?: string[],
    queueDelay = 1.5
  ): Promise<void> {
    try {
      console.log(`${hideEmail(this.login.email)}: Sending TTS: ${message}`);
      
      const processedTargets = this.processTargets(targets);
      
      const data = {
        behaviorId: 'PREVIEW',
        sequenceJson: JSON.stringify({
          '@type': 'com.amazon.alexa.behaviors.model.Sequence',
          'startNode': {
            '@type': 'com.amazon.alexa.behaviors.model.OpaquePayloadOperationNode',
            'type': 'Alexa.Speak',
            'operationPayload': {
              'deviceType': this.device.deviceType,
              'deviceSerialNumber': this.device.serialNumber,
              'customerId': customerId || this.login.customerId,
              'locale': 'en-US',
              'textToSpeak': message,
              'targets': processedTargets
            }
          }
        }),
        status: 'ENABLED'
      };

      await this.postRequest('/api/behaviors/preview', data);
      
      if (queueDelay > 0) {
        await sleep(queueDelay * 1000);
      }
    } catch (error) {
      console.error(`Error sending TTS: ${error}`);
      throw error;
    }
  }

  public async sendAnnouncement(
    message: string,
    method = 'all',
    title = 'Announcement',
    customerId?: string,
    targets?: string[],
    queueDelay = 1.5,
    extra?: Record<string, unknown>
  ): Promise<void> {
    try {
      console.log(`${hideEmail(this.login.email)}: Sending announcement: ${message}`);
      
      const processedTargets = this.processTargets(targets);
      
      const data = {
        behaviorId: 'PREVIEW',
        sequenceJson: JSON.stringify({
          '@type': 'com.amazon.alexa.behaviors.model.Sequence',
          'startNode': {
            '@type': 'com.amazon.alexa.behaviors.model.OpaquePayloadOperationNode',
            'type': 'Alexa.Announce',
            'operationPayload': {
              'deviceType': this.device.deviceType,
              'deviceSerialNumber': this.device.serialNumber,
              'customerId': customerId || this.login.customerId,
              'locale': 'en-US',
              'method': method,
              'title': title,
              'textToSpeak': message,
              'targets': processedTargets,
              ...extra
            }
          }
        }),
        status: 'ENABLED'
      };

      await this.postRequest('/api/behaviors/preview', data);
      
      if (queueDelay > 0) {
        await sleep(queueDelay * 1000);
      }
    } catch (error) {
      console.error(`Error sending announcement: ${error}`);
      throw error;
    }
  }

  public async setVolume(volume: number, customerId?: string, queueDelay = 1.5): Promise<void> {
    try {
      console.log(`${hideEmail(this.login.email)}: Setting volume to ${volume}`);
      
      const data = {
        behaviorId: 'PREVIEW',
        sequenceJson: JSON.stringify({
          '@type': 'com.amazon.alexa.behaviors.model.Sequence',
          'startNode': {
            '@type': 'com.amazon.alexa.behaviors.model.OpaquePayloadOperationNode',
            'type': 'Alexa.DeviceControls.Volume',
            'operationPayload': {
              'deviceType': this.device.deviceType,
              'deviceSerialNumber': this.device.serialNumber,
              'customerId': customerId || this.login.customerId,
              'value': volume
            }
          }
        }),
        status: 'ENABLED'
      };

      await this.postRequest('/api/behaviors/preview', data);
      
      if (queueDelay > 0) {
        await sleep(queueDelay * 1000);
      }
    } catch (error) {
      console.error(`Error setting volume: ${error}`);
      throw error;
    }
  }

  private processTargets(targets?: string[]): Array<{ deviceSerialNumber: string; deviceTypeId: string }> {
    if (!targets || targets.length === 0) {
      return [{
        deviceSerialNumber: this.device.serialNumber,
        deviceTypeId: this.device.deviceType
      }];
    }
    
    return targets.map(target => ({
      deviceSerialNumber: target,
      deviceTypeId: this.device.deviceType // This would need to be looked up properly
    }));
  }

  // Media control methods
  public async play(): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.Play');
  }

  public async pause(): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.Pause');
  }

  public async stop(customerId?: string, queueDelay = 1.5): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.Stop', customerId, queueDelay);
  }

  public async next(): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.Next');
  }

  public async previous(): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.Previous');
  }

  public async forward(): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.FastForward');
  }

  public async rewind(): Promise<void> {
    await this.sendSequence('PREVIEW:Alexa.DeviceControls.Rewind');
  }

  // Static methods for device and system information
  public static async getDevices(login: AlexaLogin): Promise<Record<string, unknown> | null> {
    try {
<<<<<<< HEAD
      console.log(`${hideEmail(login.email)}: Getting devices`);
      
      const response = await AlexaAPI.staticRequest('GET', login, '/api/devices-v2/device', undefined, { cached: 'false' });

      if (response && response.status === 200 && response.data) {
        const devices = response.data.devices || response.data;
        AlexaAPI.devices[login.email] = devices;
        console.log(`${hideEmail(login.email)}: Retrieved ${Array.isArray(devices) ? devices.length : 'unknown'} devices`);
        return devices as Record<string, unknown>;
      }
      
      console.log(`${hideEmail(login.email)}: Failed to get devices, status: ${response?.status || 'null response'}`);
      return (AlexaAPI.devices[login.email] as Record<string, unknown>) || null;
    } catch (error) {
      console.error(`${hideEmail(login.email)}: Error getting devices:`, error);
      return (AlexaAPI.devices[login.email] as Record<string, unknown>) || null;
=======
      const response = await axios.get(`https://alexa.${login.url}/api/devices-v2/device`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        withCredentials: true,
      });
      
      AlexaAPI.devices = response.data;
      return response.data;
    } catch (error) {
      console.error('Error getting devices:', error);
      return null;
>>>>>>> origin/main
    }
  }

  public static async getActivities(login: AlexaLogin, items = 10): Promise<Record<string, unknown> | null> {
    try {
<<<<<<< HEAD
      console.log(`${hideEmail(login.email)}: Getting activities`);
      
      const response = await AlexaAPI.staticRequest('GET', login, '/api/activities', undefined, {
        startTime: '',
        size: items.toString(),
        offset: '1'
      });

      if (response && response.status === 200 && response.data) {
        const result = response.data.activities || response.data;
        console.log(`${hideEmail(login.email)}: Retrieved activities`);
        return result as Record<string, unknown>;
      }
      
      console.log(`${hideEmail(login.email)}: Failed to get activities, status: ${response?.status || 'null response'}`);
      return null;
    } catch (error) {
      console.error(`${hideEmail(login.email)}: Error getting activities:`, error);
=======
      const response = await axios.get(`https://alexa.${login.url}/api/activities`, {
        params: {
          startTime: '',
          size: items,
          offset: 1
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        withCredentials: true,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting activities:', error);
>>>>>>> origin/main
      return null;
    }
  }

  public async getState(): Promise<Record<string, unknown> | null> {
    try {
      const response = await this.getRequest(`/api/np/player?deviceSerialNumber=${this.device.serialNumber}&deviceType=${this.device.deviceType}`);
      return response.data;
    } catch (error) {
      console.error('Error getting state:', error);
      return null;
    }
  }
} 