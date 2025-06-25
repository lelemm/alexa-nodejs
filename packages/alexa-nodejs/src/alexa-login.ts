/**
 * Node.js/TypeScript library for controlling Amazon Alexa devices programmatically.
 * 
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Login class.
 * 
 * Migrated from AlexaPy Python library.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';
import { URL } from 'url';
<<<<<<< HEAD
import * as tough from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import * as querystring from 'querystring';

import { USER_AGENT, CALL_VERSION, APP_NAME } from './constants';
=======

import { USER_AGENT } from './constants';
>>>>>>> origin/main
import { AlexaInvalidTOTPKeyError, AlexaLoginError } from './errors';
import { hideEmail, obfuscate } from './helpers';
import type { LoginStatus, LoginStats, OAuthTokens } from './interfaces';

<<<<<<< HEAD
export interface LoginData {
  [key: string]: string | undefined;
}

=======
>>>>>>> origin/main
export class AlexaLogin {
  private readonly hassDomain = 'alexa_media';
  private readonly prefix = 'https://alexa.';
  
  public readonly url: string;
  public readonly email: string;
  private password: string;
  
<<<<<<< HEAD
  public session!: AxiosInstance;
  public headers: Record<string, string> = {};
=======
  private session!: AxiosInstance;
  private headers: Record<string, string> = {};
>>>>>>> origin/main
  private data?: Record<string, string>;
  
  public status: LoginStatus = {};
  public stats: LoginStats = {
    login_timestamp: new Date(1, 1, 1),
    api_calls: 0,
  };
  
  private outputPath: (filename: string) => string;
  private cookieFiles: string[];
  private debugPost: string;
  private debugGet: string;
  private lastReq?: AxiosResponse;
  private debug: boolean;
  private links: Record<string, [string, string]> = {};
  private options: Record<string, string> = {};
  private site?: string;
  private closeRequested = false;
  public customerId?: string;
  private totp?: { secret: string };
  
  // OAuth properties
  public accessToken?: string;
  public refreshToken?: string;
  public macDms?: string;
  public expiresIn?: number;
  private oauthLock = false;
  
  public readonly uuid: string;
  public readonly deviceId: string;
  public readonly codeVerifier: string;
  public readonly codeChallenge: string;
  public authorizationCode?: string;
  public readonly oauthLogin: boolean;
  public proxyUrl = '';

<<<<<<< HEAD
  private _data: LoginData = {};
  private _options: { [key: string]: string } = {};
  private _site?: string;
  private _lastreq?: AxiosResponse;
  private _links?: { [key: string]: [string, string] };

=======
>>>>>>> origin/main
  constructor(
    url: string,
    email: string,
    password: string,
    outputPath: (filename: string) => string,
    debug = false,
    otpSecret = '',
    oauth: OAuthTokens = {},
    uuid?: string,
    oauthLogin = true
  ) {
    this.url = url;
    this.email = email;
    this.password = password;
    this.outputPath = outputPath;
    this.debug = debug;
    this.oauthLogin = oauthLogin;
    
    // Set up file paths
    this.cookieFiles = [
      this.outputPath(`.storage/${this.hassDomain}.${this.email}.json`),
      this.outputPath(`${this.hassDomain}.${this.email}.json`),
      this.outputPath(`.storage/${this.hassDomain}.${this.email}.txt`),
    ];
    this.debugPost = outputPath(`${this.hassDomain}${email}post.html`);
    this.debugGet = outputPath(`${this.hassDomain}${email}get.html`);
    
    // OAuth setup
    this.accessToken = oauth.access_token;
    this.refreshToken = oauth.refresh_token;
    this.macDms = oauth.mac_dms;
    this.expiresIn = oauth.expires_in;
    
    // Device identification
    this.uuid = uuid || uuidv4().replace(/-/g, '').toUpperCase();
    this.deviceId = Buffer.from(this.uuid + '23413249564c5635564d32573831').toString('hex');
    
    // PKCE for OAuth
    this.codeVerifier = oauth.code_verifier || this.generateCodeVerifier();
    this.codeChallenge = oauth.code_challenge || this.generateCodeChallenge(this.codeVerifier);
    this.authorizationCode = oauth.authorization_code;
    
    // Set up TOTP if provided
    this.setTotp(otpSecret.replace(/\s/g, ''));
    
    console.log(`Login created for ${obfuscate(this.email)} - ${this.url}`);
    this.createSession();
<<<<<<< HEAD
    
    // Initialize login status
    this.status = {
      login_successful: false,
      connected: false,
    };
    
    // Customer ID will be set during login
    this.customerId = undefined;
=======
    this.customerId = 'default-customer-id'; // This would be set during login
>>>>>>> origin/main
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  private generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
  }

  public setTotp(otpSecret: string): { secret: string } | undefined {
    if (otpSecret) {
      try {
        // Validate the secret by generating a token
        const token = speakeasy.totp({
          secret: otpSecret,
          encoding: 'base32',
        });
        
        this.totp = { secret: otpSecret };
        console.log(`TOTP token generated for ${hideEmail(this.email)}: ${token}`);
        return this.totp;
      } catch (error) {
        console.error(`Invalid TOTP secret: ${error}`);
        throw new AlexaInvalidTOTPKeyError('Invalid TOTP secret provided');
      }
    }
    
    this.totp = undefined;
    return undefined;
  }

  public getTotpToken(): string {
    if (!this.totp) {
      return '';
    }
    
    return speakeasy.totp({
      secret: this.totp.secret,
      encoding: 'base32',
    });
  }

  private createSession(force = false): void {
    if (!this.session || force) {
<<<<<<< HEAD
      console.log(`${hideEmail(this.email)}: Creating new session`);
      
=======
>>>>>>> origin/main
      this.session = axios.create({
        timeout: 30000,
        headers: {
          'User-Agent': USER_AGENT,
<<<<<<< HEAD
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
=======
>>>>>>> origin/main
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
<<<<<<< HEAD
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        },
        withCredentials: true,
        maxRedirects: 10,
        validateStatus: () => true, // Don't throw on any status code
=======
        },
        withCredentials: true,
>>>>>>> origin/main
      });
      
      this.headers = {
        'User-Agent': USER_AGENT,
<<<<<<< HEAD
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
=======
>>>>>>> origin/main
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
<<<<<<< HEAD
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
=======
>>>>>>> origin/main
      };
    }
  }

<<<<<<< HEAD
  private getCookiesFromSession(site = ''): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieHeader = this.session.defaults.headers?.common?.Cookie as string;
    
    if (cookieHeader) {
      const cookiePairs = cookieHeader.split(';');
      for (const pair of cookiePairs) {
        const [name, value] = pair.trim().split('=');
        if (name && value) {
          cookies[name] = value;
        }
      }
    }
    
    return cookies;
  }

  public get startUrl(): URL {
    const params = new URLSearchParams({
      openid_return_to: `${this.prefix}${this.url}/spa/index.html`,
      openid_identity: 'http://specs.openid.net/auth/2.0/identifier_select',
      openid_assoc_handle: 'amzn_device_na',
      openid_mode: 'checkid_setup',
      marketPlaceId: 'ATVPDKIKX0DER',
      arb: uuidv4(),
      language: 'en_US',
      openid_claimed_id: 'http://specs.openid.net/auth/2.0/identifier_select',
      openid_ns: 'http://specs.openid.net/auth/2.0',
    });

    if (this.oauthLogin) {
      params.set('openid_ns_oauth_request', 'http://specs.openid.net/extensions/oauth/1.0');
      params.set('openid_oauth_request_consumer_key', 'device_api_consumer_key');
      params.set('openid_oauth_request_scope', 'device_api');
    }

    return new URL(`${this.prefix}${this.url}/ap/signin?${params.toString()}`);
=======
  public get startUrl(): URL {
    const locale = this.url.match(/\.([a-z.]+)$/)?.[0] || '.com';
    const domain = `amazon${locale}`;
    
    return new URL(`https://${domain}/ap/signin`);
>>>>>>> origin/main
  }

  public get closeRequestedStatus(): boolean {
    return this.closeRequested;
  }

  public async close(): Promise<void> {
    this.closeRequested = true;
<<<<<<< HEAD
  }

  public async reset(): Promise<void> {
    console.log(`${hideEmail(this.email)}: Resetting login`);
    await this.deleteCookieFile();
    this.createSession(true);
  }

  private getInputs(html: string, searchField?: string | { id?: string; action?: string }): Record<string, string> {
    const $ = cheerio.load(html);
    const inputs: Record<string, string> = {};
    
    let formSelector = 'form';
    if (searchField) {
      if (typeof searchField === 'string') {
        formSelector = searchField;
      } else if (typeof searchField === 'object' && searchField.id) {
        formSelector = `form#${searchField.id}`;
      } else if (typeof searchField === 'object' && searchField.action) {
        formSelector = `form[action="${searchField.action}"]`;
      }
    }
    
    $(formSelector).first().find('input').each((_, element) => {
      const $input = $(element);
      const name = $input.attr('name');
      const value = $input.attr('value') || '';
=======
    // Clean up any resources if needed
  }

  public async reset(): Promise<void> {
    this.closeRequested = false;
    this.status = {};
    this.stats = {
      login_timestamp: new Date(1, 1, 1),
      api_calls: 0,
    };
    this.createSession(true);
    await this.deleteCookieFile();
  }

  private getInputs(html: string, searchField?: string): Record<string, string> {
    const $ = cheerio.load(html);
    const inputs: Record<string, string> = {};
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $('input').each((_: number, element: any) => {
      const name = $(element).attr('name');
      const value = $(element).attr('value') || '';
      
>>>>>>> origin/main
      if (name) {
        inputs[name] = value;
      }
    });
    
<<<<<<< HEAD
    return inputs;
  }



  /**
   * Login to Amazon
   */
  async login(cookies?: { [key: string]: string }, data?: LoginData): Promise<void> {
    data = data || {};
    
    if (cookies) {
      console.log('Using cookies to log in');
      if (await this.testLoggedIn(cookies)) {
        return;
      }
      await this.reset();
    }
    
    console.log('Using credentials to log in');
    let site = this._site || this.startUrl.toString();
    
    if (!this.session) {
      this.createSession();
    }

    // Process debug links (for testing)
    let digit: string | null = null;
    for (const [datum, value] of Object.entries(data)) {
      if (value && typeof value === 'string' && value.startsWith('link') && 
          value.length > 4 && /^\d+$/.test(value.substring(4))) {
        digit = value.substring(4);
        console.log(`Found link selection ${digit} in ${datum}`);
        if (this._links && this._links[digit]) {
          const [text, linkSite] = this._links[digit];
          data[datum] = undefined;
          site = linkSite;
          console.log(`Going to link with text: ${text} href: ${linkSite}`);
        }
      }
    }

    let resp: AxiosResponse;
    if (!digit && this._lastreq) {
              site = this._lastreq.config.url || '';
      console.log(`Loaded last request to ${site}`);
      resp = this._lastreq;
    } else {
      resp = await this.session.get(site, {
        params: this._data
      });
      this._lastreq = resp;
      site = await this._processResp(resp);
    }

    const html = resp.data;
    site = await this._processPage(html, site);
    
    if (!site) {
      return;
    }

    if (!this.status.ap_error) {
      const missingParams = this._populateData(site, data);
      
      if (this.debug) {
        if (missingParams) {
          console.log('WARNING: Detected missing params:', 
            Object.keys(this._data).filter(k => this._data[k] === ''));
        }
        console.log('Submit Form Data:', JSON.stringify(this._obfuscateData(this._data)));
        console.log('Headers:', JSON.stringify(this.session.defaults.headers));
      }

      // Submit post request with username/password and other needed info
      let postResp: AxiosResponse | null = null;
      
      if (this.status.force_get) {
        if (!this.status.approval && !this.status.action_required) {
          postResp = await this.session.get(site, {
            params: this._data
          });
        }
      } else {
        const formData = new URLSearchParams();
        Object.entries(this._data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value);
          }
        });
        
        postResp = await this.session.post(site, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      }

      if (postResp) {
        this._lastreq = postResp;
        site = await this._processResp(postResp);
        this._site = await this._processPage(postResp.data, site);
      }
    }
  }

  /**
   * Process response and handle redirects
   */
  private async _processResp(resp: AxiosResponse): Promise<string> {
    let site = resp.config.url || '';
    
    // Handle redirects
    if (resp.status >= 300 && resp.status < 400 && resp.headers.location) {
      site = resp.headers.location;
      if (site.startsWith('/')) {
        site = `https://${this.url}${site}`;
      }
    }
    
    // Update referer header
    if (this.session) {
      this.session.defaults.headers['Referer'] = site;
    }
    
    return site;
  }

  /**
   * Process HTML page to determine login state and extract form data
   */
  private async _processPage(html: string, site: string): Promise<string | undefined> {
    console.log(`Processing ${site}`);
    const $ = cheerio.load(html);
    const status: LoginStatus = {};

    // Find various form elements
    const loginForm = $('form[name="signIn"]');
    const captchaImg = $('#auth-captcha-image');
    const securityCodeInput = $('#auth-mfa-otpcode');
    const errorBox = $('#auth-error-message-box, #auth-warning-message-box');
    const claimsPickerForm = $('form[name="claimspicker"]');
    const authSelectForm = $('form[id="auth-select-device-form"]');
    const verificationForm = $('form[action="verify"]');
    const verificationCaptcha = $('img[alt="captcha"]');
    const jsAuthForm = $('form[id="pollingForm"]');
    const missingCookiesTag = $('#ap_error_return_home');
    const forgotPasswordForm = $('form[name="forgotPassword"]');
    const pollingTag = $('#updatedChannelDetails');

    // Extract error messages
    if (errorBox.length > 0) {
      let errorMessage = errorBox.find('h4').text() || 'unknown';
      errorBox.find('li span').each((_, el) => {
        errorMessage += $(el).text();
      });
      console.log('Error message:', errorMessage);
      status.error_message = errorMessage;
    }

    // Determine login state and extract form data
    if (loginForm.length > 0 && captchaImg.length === 0) {
      console.log('Found standard login page');
      this._data = this._getInputs($, 'form[name="signIn"]');
    } else if (captchaImg.length > 0) {
      console.log('Captcha requested');
      status.captcha_required = true;
      status.captcha_image_url = captchaImg.attr('src');
      this._data = this._getInputs($);
    } else if (securityCodeInput.length > 0) {
      console.log('2FA requested');
      status.securitycode_required = true;
      this._data = this._getInputs($, 'form[id="auth-mfa-form"]');
    } else if (claimsPickerForm.length > 0) {
      this._options = {};
      let index = 0;
      let claimsMessage = '';
      let optionsMessage = '';
      
      claimsPickerForm.find('div.a-row').each((_, el) => {
        claimsMessage += $(el).text() + '\n';
      });
      
      claimsPickerForm.find('label').each((_, el) => {
        const value = $(el).find('input').val() as string || '';
        const message = $(el).find('span').text().trim();
        if (value) {
          const valueMessage = `* **\`${index}\`**:\t \`${value} - ${message}\`.\n`;
          optionsMessage += valueMessage;
          this._options[index.toString()] = value;
          index++;
        }
      });
      
      console.log('Verification method requested:', claimsMessage, optionsMessage);
      status.claimspicker_required = true;
      status.claimspicker_message = optionsMessage;
      this._data = this._getInputs($, 'form[name="claimspicker"]');
    } else if (authSelectForm.length > 0) {
      this._options = {};
      let index = 0;
      let authSelectMessage = '';
      let authOptionsMessage = '';
      
      $('.a-box-inner').each((_, el) => {
        const pText = $(el).find('p').text();
        if (pText) {
          authSelectMessage += pText + '\n';
        }
      });
      
      authSelectForm.find('label').each((_, el) => {
        const value = $(el).find('input').val() as string || '';
        const message = $(el).find('span').text().trim();
        if (value) {
          const valueMessage = `${index}:\t${message}\n`;
          authOptionsMessage += valueMessage;
          this._options[index.toString()] = value;
          index++;
        }
      });
      
      console.log('OTP method requested:', authSelectMessage, authOptionsMessage);
      status.authselect_required = true;
      status.authselect_message = authOptionsMessage;
      this._data = this._getInputs($, 'form[id="auth-select-device-form"]');
    } else if (verificationCaptcha.length > 0) {
      console.log('Verification captcha code requested');
      status.captcha_required = true;
      status.captcha_image_url = verificationCaptcha.attr('src');
      status.verification_captcha_required = true;
      this._data = this._getInputs($, 'form[action="verify"]');
    } else if (verificationForm.length > 0) {
      console.log('Verification code requested');
      status.verificationcode_required = true;
      this._data = this._getInputs($, 'form[action="verify"]');
    } else if (missingCookiesTag.length > 0 && !site.includes('/ap/maplanding')) {
      console.log('Error page detected');
      let href = '';
      missingCookiesTag.find('a[href]').each((_, el) => {
        href = $(el).attr('href') || '';
      });
      status.ap_error = true;
      status.force_get = true;
      status.ap_error_href = href;
    } else if (jsAuthForm.length > 0) {
      let message = $('span').first().text();
      $('#channelDetails div').each((_, el) => {
        message += $(el).text();
      });
      status.force_get = true;
      status.message = message.replace(/\s+/g, ' ');
      status.action_required = true;
      console.log('Javascript Authentication page detected:', message);
    } else if (forgotPasswordForm.length > 0 || $('input[name="OTPChallengeOptions"]').length > 0) {
      status.message = 'Forgot password page detected; Amazon has detected too many failed logins. Please check to see if Amazon requires any further action. You may have to wait before retrying.';
      status.ap_error = true;
      console.log(status.message);
      status.login_failed = 'forgot_password';
    } else if (pollingTag.length > 0) {
      status.force_get = true;
      status.message = this.status.message;
      const approvalStatus = $('#transactionApprovalStatus').val() as string;
      console.log('Polling page detected with approval status:', approvalStatus);
      status.approval_status = approvalStatus;
    } else {
      console.log('Captcha/2FA not requested; confirming login.');
      
      // Check for access token in URL
      const urlParams = new URL(site).searchParams;
      this.accessToken = urlParams.get('openid.oa2.access_token');
      
      if (await this.testLoggedIn()) {
        return undefined;
      }
      
      console.log('Login failed; check credentials');
      status.login_failed = 'login_failed';
      
      if (this._data && Object.values(this._data).some(v => v === '')) {
        const missing = Object.keys(this._data).filter(k => this._data[k] === '');
        console.log('If credentials correct, please report these missing values:', missing);
      }
    }

    this.status = status;

    // Determine post URL if not logged in
    if (status.approval_status === 'TransactionCompleted') {
      site = this._data.openid?.return_to || site;
    } else if ($('form').length > 0 && !status.login_successful) {
      const form = $('form').first();
      const formAction = form.attr('action');
      
      if (formAction === 'verify') {
        const match = site.match(/(.+)\/(.*)/);
        if (match) {
          site = match[1] + '/verify';
          console.log('Found post url to verify; converting to', site);
        }
      } else if (formAction === 'get') {
        if (status.ap_error && status.ap_error_href) {
          site = status.ap_error_href;
        } else if (this.session.defaults.headers['Referer']) {
          site = this.session.defaults.headers['Referer'] as string;
        } else {
          site = this.startUrl;
        }
        console.log('Found post url to get; forcing get to', site);
        this._lastreq = undefined;
      } else if (formAction === '/ap/cvf/approval/poll') {
        this._data = this._getInputs($, 'form[id="pollingForm"]');
        const url = new URL(site);
        site = `${url.protocol}//${url.host}${formAction}`;
        console.log('Found url for polling page', site);
      } else if (formAction && forgotPasswordForm.length > 0) {
        site = this.startUrl;
        console.log('Restarting login process', site);
      } else if (formAction) {
        if (formAction.startsWith('/')) {
          site = `https://${this.url}${formAction}`;
        } else if (formAction.startsWith('http')) {
          site = formAction;
        } else {
          const url = new URL(site);
          site = `${url.protocol}//${url.host}/${formAction}`;
        }
        console.log('Found post url to', site);
      }
    }

    return site;
  }

  /**
   * Extract form inputs from page
   */
  private _getInputs($: cheerio.CheerioAPI, selector?: string): LoginData {
    const data: LoginData = {};
    const searchForm = selector ? $(selector) : $('form').first();
    
    if (searchForm.length === 0) {
      return data;
    }

    searchForm.find('input').each((_, el) => {
      const input = $(el);
      const name = input.attr('name');
      const type = input.attr('type');
      const value = input.attr('value');
      
      if (name) {
        data[name] = '';
        if (type === 'hidden' && value) {
          data[name] = value;
        }
      }
    });

    return data;
  }

  /**
   * Populate form data with user credentials and other inputs
   */
  private _populateData(site: string, data: LoginData): boolean {
    console.log('Preparing form submission to', site, 'with input data:', this._obfuscateData(data));
    
    // Extract data from input
    const password = data.password || '';
    const captcha = data.captcha || '';
    const securitycode = data.securitycode || '';
    const claimsoption = data.claimsoption || '';
    const authopt = data.authselectoption || '';
    const verificationcode = data.verificationcode || '';

    // Populate form data
    if (this._data) {
      // Add email/username
      if (this._data.email !== undefined && this._data.email === '') {
        this._data.email = this.email;
      }
      
      // Add password (with optional security code)
      this._data.password = password || this.password;
      if (securitycode) {
        this._data.password += securitycode;
      }
      
      // Remember me
      if (this._data.rememberMe !== undefined) {
        this._data.rememberMe = 'true';
      }
      
      // Captcha
      if (captcha && this._data.guess !== undefined) {
        this._data.guess = captcha;
      }
      if (captcha && this._data.cvf_captcha_input !== undefined) {
        this._data.cvf_captcha_input = captcha;
        this._data.cvf_captcha_captcha_action = 'verifyCaptcha';
      }
      
      // Security code
      if (securitycode && this._data.otpCode !== undefined) {
        this._data.otpCode = securitycode;
        this._data.rememberDevice = 'true';
      }
      
      // Claims picker option
      if (claimsoption && this._data.option !== undefined) {
        const option = this._options[claimsoption];
        if (option) {
          this._data.option = option;
        } else {
          console.log(`Selected claimspicker option ${claimsoption} not in`, this._options);
        }
      }
      
      // Auth select option
      if (authopt && this._data.otpDeviceContext !== undefined) {
        const option = this._options[authopt];
        if (option) {
          this._data.otpDeviceContext = option;
        } else {
          console.log(`Selected OTP option ${authopt} not in`, this._options);
        }
      }
      
      // Verification code
      if (verificationcode && this._data.code !== undefined) {
        this._data.code = verificationcode;
      }
      
      // Remove empty key
      delete this._data[''];
      
      // Check for unfilled values
      return Object.values(this._data).some(v => v === '');
    }
    
    return false;
  }

  /**
   * Obfuscate sensitive data for logging
   */
  private _obfuscateData(data: LoginData): LoginData {
    const obfuscated: LoginData = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
        obfuscated[key] = value ? '***' : value;
      } else {
        obfuscated[key] = value;
      }
    }
    return obfuscated;
  }

  /**
   * Test if logged in by checking bootstrap endpoint
   */
  async testLoggedIn(cookies?: { [key: string]: string }): Promise<boolean> {
    if (this.debug) {
      console.log(`Testing whether logged in to alexa.${this.url}`);
      console.log('Cookies:', cookies);
    }
    
    if (!this.session) {
      this.createSession();
    }

    // Try to get tokens and set up session
    await this.getTokens();
    await this.registerCapabilities();
    await this.exchangeTokenForCookies();
    await this.getCsrf();

    let path = `https://amazon.com/api/bootstrap`;
    let response: AxiosResponse;
    
    try {
      response = await this.session.get(path, { 
        withCredentials: true,
        ...(cookies && { headers: { Cookie: Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ') } })
      });
      await this._processResp(response);
    } catch (error) {
      console.log('Not logged in:', error);
      if (this.url.toLowerCase() === 'amazon.com') {
        return false;
      }
    }

    let json: any;
    let email: string | null = null;

    try {
      json = response!.data;
      email = json.authentication?.customerEmail;
    } catch (error) {
      console.log('Not logged in:', error);
      if (this.url.toLowerCase() === 'amazon.com') {
        return false;
      }
    }

    // Convert from amazon.com domain to native domain
    if (this.url.toLowerCase() !== 'amazon.com') {
      if (this.session) {
        this.session.defaults.headers['authority'] = `www.${this.url}`;
      }
      
      path = `https://${this.url}/api/bootstrap`;
      
      try {
        response = await this.session.get(path);
        await this._processResp(response);
        json = response.data;
        email = json.authentication?.customerEmail;
      } catch (error) {
        console.log('Not logged in:', error);
        return false;
      }
    }

    this.customerId = json?.authentication?.customerId;
    
    if ((email && email.toLowerCase() === this.email.toLowerCase()) || !this.email.includes('@')) {
      if (this.email.includes('@')) {
        console.log(`Logged in as ${email} to ${this.url} with id: ${this.customerId}`);
      } else {
        console.log(`Logged in to ${this.url} mobile account ${email} with ${this.customerId}`);
      }
      
      await this.checkDomain();
      await this.finalizeLogin();
      return true;
    }
    
    console.log('Not logged in due to email mismatch');
    await this.reset();
    return false;
  }

  /**
   * Check domain and update headers
   */
  async checkDomain(): Promise<boolean> {
    // Implementation would check domain-specific settings
    return true;
  }

  /**
   * Finalize login process
   */
  async finalizeLogin(): Promise<void> {
    console.log(`Login confirmed for ${this.email} - ${this.url}; saving session`);
    this.status = {};
    this.status.login_successful = true;
    
    // Remove extraneous Content-Type to avoid 500 errors
    if (this.session) {
      delete this.session.defaults.headers['Content-Type'];
    }
  }

  private async deleteCookieFile(): Promise<void> {
    for (const file of this.cookieFiles) {
      try {
        await fs.unlink(file);
        console.log(`${hideEmail(this.email)}: Deleted cookie file: ${file}`);
      } catch (error) {
        // File doesn't exist, ignore
=======
    if (searchField && inputs[searchField]) {
      return { [searchField]: inputs[searchField] };
    }
    
    return inputs;
  }

  public async testLoggedIn(_cookies?: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.session.get(`${this.prefix}${this.url}/spa/index.html`, {
        headers: this.headers,
      });
      
      return response.status === 200 && !response.data.includes('ap/signin');
    } catch (error) {
      console.error('Error testing login status:', error);
      return false;
    }
  }

  public async login(
    cookies?: Record<string, string>,
    data?: Record<string, string>
  ): Promise<void> {
    this.status.login_successful = false;
    
    try {
      // Start login process
      const loginUrl = this.startUrl.toString();
      const response = await this.session.get(loginUrl, { headers: this.headers });
      
      // Extract form data
      const formInputs = this.getInputs(response.data);
      
      // Submit credentials
      const loginData = {
        ...formInputs,
        email: this.email,
        password: this.password,
        ...data,
      };
      
      const loginResponse = await this.session.post(loginUrl, loginData, {
        headers: {
          ...this.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Handle response and potential 2FA
      await this.processPage(loginResponse.data, loginUrl);
      
      this.status.login_successful = true;
      this.stats.login_timestamp = new Date();
      
    } catch (error) {
      console.error('Login failed:', error);
      throw new AlexaLoginError(`Login failed: ${error}`);
    }
  }

  private async processPage(html: string, _site: string): Promise<string> {
    // Process the current page and handle different login steps
    // This would handle 2FA, captcha, etc.
    return html;
  }

  private async deleteCookieFile(): Promise<void> {
    for (const cookieFile of this.cookieFiles) {
      try {
        await fs.unlink(cookieFile);
      } catch (error) {
        // File might not exist, ignore
>>>>>>> origin/main
      }
    }
  }

  public async getTokens(): Promise<boolean> {
<<<<<<< HEAD
    console.log(`${hideEmail(this.email)}: Getting OAuth tokens`);
    
    const frc = crypto.randomBytes(313).toString('base64').replace(/=/g, '');
    const mapMdRaw = {
      device_user_dictionary: [],
      device_registration_data: { software_version: "1" },
      app_identifier: {
        app_version: CALL_VERSION,
        bundle_id: "com.amazon.echo",
      },
    };
    const mapMd = Buffer.from(JSON.stringify(mapMdRaw)).toString('base64').replace(/=/g, '');

    const urls = this.url.toLowerCase() !== "amazon.com" ? [this.url, "amazon.com"] : [this.url];
    
    for (const url of urls) {
      const cookies = this.getCookiesFromSession(`https://${url}`);
      cookies.frc = frc;
      cookies['map-md'] = mapMd;
      
      const cookiesList: any[] = [];
      
      const data = {
        requested_extensions: ["device_info", "customer_info"],
        cookies: { website_cookies: cookiesList, domain: `.${url}` },
        registration_data: {
          domain: "Device",
          app_version: CALL_VERSION,
          device_type: "A2IVLV5VM2W81",
          device_name: `%FIRST_NAME%'s%DUPE_STRATEGY_1ST%${APP_NAME}`,
          os_version: "16.6",
          device_serial: this.uuid,
          device_model: "iPhone",
          app_name: APP_NAME,
          software_version: "1",
        },
        auth_data: {} as any,
        user_context_map: { frc },
        requested_token_type: ["bearer", "mac_dms", "website_cookies"],
      };

      if (this.accessToken) {
        data.auth_data = { access_token: this.accessToken };
      } else if (this.codeVerifier && this.authorizationCode) {
        data.auth_data = {
          client_id: this.deviceId,
          authorization_code: this.authorizationCode,
          code_verifier: this.codeVerifier,
          code_algorithm: "SHA-256",
          client_domain: "DeviceLegacy",
        };
      }

      console.log(`${hideEmail(this.email)}: Attempting to register with ${url}`);
      
      try {
        let response: AxiosResponse;
        try {
          response = await this.session.post(`https://api.${url}/auth/register`, data, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true,
          });
        } catch (error) {
          console.log(`${hideEmail(this.email)}: Fallback attempt to register with api.amazon.com`);
          response = await this.session.post('https://api.amazon.com/auth/register', data, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true,
          });
        }

        console.log(`${hideEmail(this.email)}: Auth response status: ${response.status}`);
        
        if (response.status === 200) {
          const responseData = response.data?.response;
          if (responseData?.success) {
            console.log(`${hideEmail(this.email)}: Successfully registered device with Amazon`);
            
            this.refreshToken = responseData.success.tokens.bearer.refresh_token;
            this.macDms = responseData.success.tokens.mac_dms;
            const oldToken = this.accessToken;
            this.accessToken = responseData.success.tokens.bearer.access_token;
            this.expiresIn = Date.now() / 1000 + parseInt(responseData.success.tokens.bearer.expires_in);
            
            if (oldToken !== this.accessToken) {
              console.log(`${hideEmail(this.email)}: New access token received, expires at ${new Date(this.expiresIn * 1000)}`);
            }
            
            return true;
          }
        }
      } catch (error) {
        console.error(`${hideEmail(this.email)}: Error during token registration:`, error);
      }
    }
    
    console.log(`${hideEmail(this.email)}: Unable to register with any domain`);
=======
    // OAuth token acquisition
>>>>>>> origin/main
    return false;
  }

  public async refreshAccessToken(): Promise<boolean> {
<<<<<<< HEAD
    console.log(`${hideEmail(this.email)}: Refreshing access token`);
    
    if (!this.refreshToken) {
      console.log(`${hideEmail(this.email)}: No refresh token found`);
      return false;
    }

    const data = {
      app_name: APP_NAME,
      app_version: CALL_VERSION,
      'di.sdk.version': '6.12.4',
      source_token: this.refreshToken,
      package_name: 'com.amazon.echo',
      'di.hw.version': 'iPhone',
      platform: 'iOS',
      requested_token_type: 'access_token',
      source_token_type: 'refresh_token',
      'di.os.name': 'iOS',
      'di.os.version': '16.6',
      current_version: '6.12.4',
      previous_version: '6.12.4',
    };

    try {
      let response: AxiosResponse;
      try {
        response = await this.session.post(`https://api.${this.url}/auth/token`, data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          validateStatus: () => true,
        });
      } catch (error) {
        console.log(`${hideEmail(this.email)}: Fallback attempt to refresh with api.amazon.com`);
        response = await this.session.post('https://api.amazon.com/auth/token', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          validateStatus: () => true,
        });
      }

      console.log(`${hideEmail(this.email)}: Refresh response status: ${response.status}`);
      
      if (response.status === 200 && response.data?.access_token) {
        this.accessToken = response.data.access_token;
        this.expiresIn = Date.now() / 1000 + parseInt(response.data.expires_in);
        
        console.log(`${hideEmail(this.email)}: Successfully refreshed access token, expires at ${new Date(this.expiresIn * 1000)}`);
        return true;
      }
      
      console.log(`${hideEmail(this.email)}: Failed to refresh access token`);
      return false;
    } catch (error) {
      console.error(`${hideEmail(this.email)}: Error refreshing access token:`, error);
      return false;
    }
  }

  public async exchangeTokenForCookies(): Promise<boolean> {
    console.log(`${hideEmail(this.email)}: Exchanging token for cookies`);
    
    if (!this.refreshToken) {
      console.log(`${hideEmail(this.email)}: No refresh token found`);
      return false;
    }

    const data = {
      app_name: APP_NAME,
      app_version: CALL_VERSION,
      'di.sdk.version': '6.12.4',
      domain: `.${this.url}`,
      source_token: this.refreshToken,
      package_name: 'com.amazon.echo',
      'di.hw.version': 'iPhone',
      platform: 'iOS',
      requested_token_type: 'auth_cookies',
      source_token_type: 'refresh_token',
      'di.os.name': 'iOS',
      'di.os.version': '16.6',
      current_version: '6.12.4',
      previous_version: '6.12.4',
    };

    try {
      let response: AxiosResponse;
      try {
        response = await this.session.post(`https://www.${this.url}/ap/exchangetoken/cookies`, data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          validateStatus: () => true,
        });
      } catch (error) {
        console.log(`${hideEmail(this.email)}: Fallback attempt to exchange with www.amazon.com`);
        response = await this.session.post('https://www.amazon.com/ap/exchangetoken/cookies', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          validateStatus: () => true,
        });
      }

      console.log(`${hideEmail(this.email)}: Exchange response status: ${response.status}`);
      
      if (response.status === 200 && response.data?.response?.tokens?.cookies) {
        const cookies = response.data.response.tokens.cookies;
        let success = false;
        
        for (const [domain, cookieList] of Object.entries(cookies)) {
          if (Array.isArray(cookieList)) {
            const cookieStrings: string[] = [];
            
            for (const cookie of cookieList) {
              if (cookie.Name && cookie.Value) {
                let cookieValue = cookie.Value;
                // Remove quotes if present
                if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
                  cookieValue = cookieValue.slice(1, -1);
                }
                
                cookieStrings.push(`${cookie.Name}=${cookieValue}`);
              }
            }
            
            if (cookieStrings.length > 0) {
              // Set cookies in session
              this.session.defaults.headers.common.Cookie = cookieStrings.join('; ');
              console.log(`${hideEmail(this.email)}: Exchanged refresh token for ${cookieList.length} ${domain} cookies`);
              success = true;
            }
          }
        }
        
        return success;
      }
      
      console.log(`${hideEmail(this.email)}: Failed to exchange token for cookies`);
      return false;
    } catch (error) {
      console.error(`${hideEmail(this.email)}: Error exchanging token for cookies:`, error);
      return false;
    }
  }

  public async getCsrf(): Promise<boolean> {
    console.log(`${hideEmail(this.email)}: Getting CSRF token`);
    
    // Check if CSRF already exists in cookies
    const cookies = this.getCookiesFromSession();
    if (cookies.csrf) {
      console.log(`${hideEmail(this.email)}: CSRF already exists; no need to discover`);
      this.headers.csrf = cookies.csrf;
      return true;
    }

    console.log(`${hideEmail(this.email)}: Attempting to discover CSRF token`);
    const csrfUrls = [
      '/spa/index.html',
      '/api/language',
      '/api/devices-v2/device?cached=false',
      '/templates/oobe/d-device-pick.handlebars',
      '/api/strings',
    ];

    for (const url of csrfUrls) {
      try {
        const path = `${this.prefix}${this.url}${url}`;
        const response = await this.session.get(path, {
          headers: this.headers,
          validateStatus: () => true,
        });

        if (response.status !== 200) {
          console.log(`${hideEmail(this.email)}: Unable to load page for CSRF: ${path}, status: ${response.status}`);
          continue;
        }

        // Check if CSRF token is now in cookies
        const setCookies = response.headers['set-cookie'];
        if (setCookies) {
          for (const cookie of setCookies) {
            const csrfMatch = cookie.match(/csrf=([^;]+)/);
            if (csrfMatch) {
              this.headers.csrf = csrfMatch[1];
              console.log(`${hideEmail(this.email)}: CSRF token found from ${url}: ${csrfMatch[1]}`);
              return true;
            }
          }
        }
        
        console.log(`${hideEmail(this.email)}: CSRF token not found from ${url}`);
      } catch (error) {
        console.log(`${hideEmail(this.email)}: Failed to get CSRF from ${url}:`, error);
        continue;
      }
    }

    console.log(`${hideEmail(this.email)}: No CSRF token found`);
    return false;
  }

  public async registerCapabilities(): Promise<void> {
    // Implementation of registerCapabilities method
=======
    // OAuth token refresh
    return false;
  }

  public async exchangeTokenForCookies(): Promise<boolean> {
    // Exchange OAuth tokens for session cookies
    return false;
  }

  public async getCsrf(): Promise<boolean> {
    // Get CSRF token
    return false;
  }

  public async finalizeLogin(): Promise<void> {
    // Finalize the login process
>>>>>>> origin/main
  }
} 