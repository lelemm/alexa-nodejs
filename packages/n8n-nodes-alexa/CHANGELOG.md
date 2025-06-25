# Changelog

All notable changes to the n8n-nodes-alexa package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-25

### Added
- Initial release of n8n-nodes-alexa
- **Alexa API Credentials**: Secure authentication with Amazon accounts
  - Support for email/password authentication
  - Optional 2FA/TOTP support with Base32 secrets
  - Multiple Amazon domain support (US, UK, DE, CA, AU, FR, IT, ES, JP, BR, IN, MX)
  - Debug mode for troubleshooting
- **Alexa Node** with comprehensive device control operations:
  - **Device Management**: Get devices, get device state, get activities
  - **Voice & Announcements**: Send TTS, send announcements with custom titles
  - **Media Control**: Play, pause, stop, next track, previous track
  - **Device Control**: Set volume (0-100), send custom sequences
  - **Multi-device Support**: Target multiple devices with single operations
  - **Rate Limiting**: Configurable queue delays to prevent API throttling
- **TypeScript Support**: Full type definitions for all operations
- **Comprehensive Documentation**:
  - README with feature overview and usage examples
  - INSTALLATION guide with step-by-step setup
  - Example workflow demonstrating all major operations
  - Troubleshooting guide for common issues
- **Development Tools**:
  - TypeScript configuration optimized for n8n
  - Build scripts for development and production
  - Package script for distribution

### Technical Details
- Built on `alexa-nodejs` library for device communication
- Supports n8n API version 1
- Compatible with n8n workflow automation platform
- Includes custom SVG icon for visual identification
- Yarn workspace integration for monorepo development

### Supported Operations
1. **getDevices** - Retrieve all available Alexa devices
2. **sendTTS** - Send text-to-speech messages to devices
3. **sendAnnouncement** - Send announcements to one or multiple devices
4. **setVolume** - Control device volume (0-100 scale)
5. **play** - Start media playback
6. **pause** - Pause current media
7. **stop** - Stop media playback
8. **next** - Skip to next track
9. **previous** - Go to previous track
10. **getState** - Get current device state and status
11. **getActivities** - Retrieve recent device activities
12. **sendSequence** - Send custom Alexa sequence commands

### Dependencies
- `alexa-nodejs`: Core library for Alexa device communication
- `n8n-workflow`: n8n framework for node development
- `typescript`: Type safety and modern JavaScript features
- `rimraf`: Build artifact cleanup 