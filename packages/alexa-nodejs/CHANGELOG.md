# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of alexa-nodejs library
- TypeScript/Node.js migration of the AlexaPy Python library
- Core AlexaLogin class for authentication
- AlexaAPI class for device control
- Support for text-to-speech (TTS)
- Support for announcements
- Volume control functionality
- Media playback controls (play, pause, stop, next, previous)
- Device information retrieval
- Activity monitoring
- 2FA/TOTP support
- OAuth authentication flow
- Complete TypeScript type definitions
- Comprehensive test project
- Full documentation

### Features
- 🎯 Device Control: Send TTS, announcements, control volume, media playback
- 🔐 Authentication: Login with Amazon credentials and 2FA support
- 📱 Device Management: Get device information and status
- 🔄 Sequence Commands: Execute custom Alexa sequences
- 📊 Activity Monitoring: Get recent activities and device states
- 🏠 Smart Home: Control Guard mode and other smart home features

### Dependencies
- axios: HTTP client for API requests
- cheerio: HTML parsing for web scraping
- speakeasy: TOTP/2FA token generation
- uuid: Unique identifier generation
- ws: WebSocket client support

### Development
- TypeScript 5.x support
- ESLint configuration
- Jest testing framework
- Comprehensive build system
- Yarn package manager support 