# alexa-nodejs

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://img.shields.io/npm/v/alexa-nodejs.svg)](https://npmjs.org/package/alexa-nodejs)

Node.js/TypeScript library for controlling Amazon Alexa devices (Echo Dot, etc.) programmatically. This is a migration of the popular [AlexaPy](https://gitlab.com/keatontaylor/alexapy) Python library.

**NOTE:** Alexa has no official API; therefore, this library may stop working at any time without warning.

## Features

- 🎯 **Device Control**: Send TTS, announcements, control volume, media playback
- 🔐 **Authentication**: Login with Amazon credentials and 2FA support
- 📱 **Device Management**: Get device information and status
- 🔄 **Sequence Commands**: Execute custom Alexa sequences
- 📊 **Activity Monitoring**: Get recent activities and device states
- 🏠 **Smart Home**: Control Guard mode and other smart home features

## Installation

Using npm:
```bash
npm install alexa-nodejs
```

Using yarn:
```bash
yarn add alexa-nodejs
```

## Quick Start

```typescript
import { AlexaLogin, AlexaAPI } from 'alexa-nodejs';

// Create login instance
const login = new AlexaLogin(
  'amazon.com',              // Amazon domain
  'your.email@example.com',  // Your Amazon email
  'your_password',           // Your Amazon password
  (filename) => `./storage/${filename}`, // Storage path function
  false,                     // Debug mode
  'YOUR_2FA_SECRET'          // Optional: 2FA secret
);

// Login
await login.login();

// Get devices
const devices = await AlexaAPI.getDevices(login);
const device = devices.devices[0]; // Use first device

// Create API instance
const api = new AlexaAPI(device, login);

// Send text-to-speech
await api.sendTTS('Hello from Node.js!');

// Control volume
await api.setVolume(50);

// Send announcement
await api.sendAnnouncement('Dinner is ready!');
```

## API Reference

### AlexaLogin

Main authentication class for logging into Amazon Alexa services.

```typescript
const login = new AlexaLogin(
  url: string,           // Amazon domain (e.g., 'amazon.com')
  email: string,         // Amazon account email
  password: string,      // Amazon account password
  outputPath: (filename: string) => string, // Storage path function
  debug?: boolean,       // Enable debug mode (default: false)
  otpSecret?: string,    // 2FA secret (default: '')
  oauth?: OAuthTokens,   // OAuth tokens (default: {})
  uuid?: string,         // Device UUID (default: auto-generated)
  oauthLogin?: boolean   // Use OAuth login (default: true)
);
```

#### Methods

- `login(cookies?, data?)`: Perform login
- `testLoggedIn(cookies?)`: Test if already logged in
- `getTotpToken()`: Generate 2FA token
- `close()`: Close session
- `reset()`: Reset login state

### AlexaAPI

Main API class for controlling Alexa devices.

```typescript
const api = new AlexaAPI(device: AlexaDevice, login: AlexaLogin);
```

#### Device Control Methods

- `sendTTS(message, customerId?, targets?, queueDelay?)`: Send text-to-speech
- `sendAnnouncement(message, method?, title?, customerId?, targets?, queueDelay?, extra?)`: Send announcement
- `setVolume(volume, customerId?, queueDelay?)`: Set device volume
- `sendSequence(sequence, customerId?, queueDelay?, extra?)`: Send custom sequence

#### Media Control Methods

- `play()`: Play media
- `pause()`: Pause media
- `stop(customerId?, queueDelay?, allDevices?)`: Stop media
- `next()`: Next track
- `previous()`: Previous track
- `forward()`: Fast forward
- `rewind()`: Rewind

#### Information Methods

- `getState()`: Get device state
- `static getDevices(login)`: Get all devices
- `static getActivities(login, items?)`: Get recent activities

## Environment Configuration

Create a `.env` file for configuration:

```env
ALEXA_EMAIL=your.email@example.com
ALEXA_PASSWORD=your_password_here
ALEXA_DOMAIN=amazon.com
ALEXA_OTP_SECRET=your_2fa_secret_here
```

## Test Project

The library includes a test project demonstrating usage:

```bash
cd test-project
yarn install
cp .env.example .env
# Edit .env with your credentials
yarn dev
```

## Development

### Building the Library

```bash
# Install dependencies
yarn install

# Build the library
yarn build

# Watch for changes
yarn watch

# Run linting
yarn lint

# Run tests
yarn test
```

### Project Structure

```
alexa-nodejs/
├── src/
│   ├── alexa-api.ts        # Main API class
│   ├── alexa-login.ts      # Authentication class
│   ├── constants.ts        # Constants and configuration
│   ├── errors.ts          # Error classes
│   ├── helpers.ts         # Utility functions
│   ├── interfaces.ts      # TypeScript interfaces
│   └── index.ts           # Main export file
├── test-project/          # Example usage project
├── dist/                  # Compiled JavaScript (generated)
└── package.json
```

## Credits

This library is a TypeScript/Node.js migration of the original [AlexaPy](https://gitlab.com/keatontaylor/alexapy) Python library created by:
- Keaton Taylor
- Alan Tse

Originally inspired by [alexa-remote-control](https://github.com/thorsten-gehrig/alexa-remote-control) by Thorsten Gehrig.

## Contributing

1. [Check for open features/bugs](https://github.com/your-repo/alexa-nodejs/issues)
2. [Fork the repository](https://github.com/your-repo/alexa-nodejs/fork)
3. Install dev environment: `yarn install`
4. Code your new feature or bug fix
5. Write tests that cover your new functionality
6. Update documentation if needed
7. Run tests and ensure they pass: `yarn test`
8. Run linting and ensure no errors: `yarn lint`
9. Submit a pull request

## License

[Apache-2.0](LICENSE). By providing a contribution, you agree the contribution is licensed under Apache-2.0.

## Disclaimer

This library is not affiliated with Amazon. Use at your own risk. Amazon may change their APIs at any time, which could break this library. 