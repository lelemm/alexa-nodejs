import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AlexaApi implements ICredentialType {
  name = 'alexaApi';
  displayName = 'Alexa API';
  documentationUrl = 'https://github.com/your-repo/alexa-nodejs';
  properties: INodeProperties[] = [
    {
      displayName: 'Amazon Email',
      name: 'email',
      type: 'string',
      default: '',
      placeholder: 'your.email@example.com',
      description: 'Your Amazon account email address',
      required: true,
    },
    {
      displayName: 'Amazon Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Your Amazon account password',
      required: true,
    },
    {
      displayName: 'Amazon Domain',
      name: 'domain',
      type: 'options',
      options: [
        { name: 'amazon.com (US)', value: 'amazon.com' },
        { name: 'amazon.co.uk (UK)', value: 'amazon.co.uk' },
        { name: 'amazon.de (Germany)', value: 'amazon.de' },
        { name: 'amazon.ca (Canada)', value: 'amazon.ca' },
        { name: 'amazon.com.au (Australia)', value: 'amazon.com.au' },
        { name: 'amazon.fr (France)', value: 'amazon.fr' },
        { name: 'amazon.it (Italy)', value: 'amazon.it' },
        { name: 'amazon.es (Spain)', value: 'amazon.es' },
        { name: 'amazon.co.jp (Japan)', value: 'amazon.co.jp' },
        { name: 'amazon.com.br (Brazil)', value: 'amazon.com.br' },
        { name: 'amazon.in (India)', value: 'amazon.in' },
        { name: 'amazon.com.mx (Mexico)', value: 'amazon.com.mx' },
      ],
      default: 'amazon.com',
      description: 'Your Amazon domain/country',
      required: true,
    },
    {
      displayName: '2FA Secret (Optional)',
      name: 'otpSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      placeholder: 'ABCD1234EFGH5678...',
      description: 'Base32 secret from your 2FA app (Google Authenticator, Authy, etc.). Leave empty if 2FA is not enabled.',
    },
    {
      displayName: 'Debug Mode',
      name: 'debug',
      type: 'boolean',
      default: false,
      description: 'Whether to enable debug logging',
    },
  ];

  test = {
    request: {
      baseURL: 'https://alexa.amazon.com',
      url: '/api/bootstrap',
    },
  };
} 