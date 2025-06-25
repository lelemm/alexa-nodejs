# n8n-nodes-alexa

An n8n custom node for controlling Amazon Alexa devices using the `alexa-nodejs` library.

## Features

- **Comprehensive Alexa Control**: Control your Alexa devices directly from n8n workflows
- **Multiple Operations**: Support for TTS, announcements, media control, volume control, and more
- **Secure Authentication**: Built-in support for Amazon credentials with optional 2FA
- **Multi-device Support**: Target multiple devices with a single operation
- **TypeScript Support**: Fully typed for better development experience

## Installation

### Option 1: Manual Installation (Development)

1. Clone this repository
2. Build the package:
   ```bash
   cd packages/n8n-nodes-alexa
   yarn build
   ```
3. Install in your n8n instance:
   ```bash
   # In your n8n installation directory
   npm install /path/to/n8n-nodes-alexa
   ```

### Option 2: npm Installation (Coming Soon)

```bash
npm install n8n-nodes-alexa
```

### Option 3: Community Nodes (Coming Soon)

Install via n8n's community nodes interface in the web UI.

## Setup

### 1. Configure Credentials

In n8n, create new credentials using the "Alexa API" type:

- **Amazon Email**: Your Amazon account email
- **Amazon Password**: Your Amazon account password  
- **Amazon Domain**: Select your country's Amazon domain (e.g., amazon.com, amazon.co.uk)
- **2FA Secret** (Optional): Base32 secret from your authenticator app if 2FA is enabled
- **Debug Mode** (Optional): Enable for troubleshooting

### 2. Add Alexa Node

Add the "Alexa" node to your workflow and select your configured credentials.

## Operations

### Device Management
- **Get Devices**: Retrieve all available Alexa devices
- **Get Device State**: Get current state of a specific device
- **Get Activities**: Retrieve recent device activities

### Voice & Announcements
- **Send TTS**: Send text-to-speech to one or more devices
- **Send Announcement**: Send announcements with custom titles

### Media Control
- **Play Media**: Start media playback
- **Pause Media**: Pause current media
- **Stop Media**: Stop media playback
- **Next Track**: Skip to next track
- **Previous Track**: Go to previous track

### Device Control
- **Set Volume**: Control device volume (0-100)
- **Send Sequence**: Send custom sequence commands

## Usage Examples

### Simple TTS Example

```json
{
  "operation": "sendTTS",
  "deviceSerial": "G000FL0123456789",
  "message": "Hello from n8n!",
  "queueDelay": 1.5
}
```

### Multi-device Announcement

```json
{
  "operation": "sendAnnouncement",
  "targets": "G000FL0123456789,G000FL0987654321",
  "message": "Dinner is ready!",
  "title": "Kitchen Announcement",
  "announcementMethod": "all"
}
```

### Volume Control

```json
{
  "operation": "setVolume",
  "deviceSerial": "G000FL0123456789",
  "volume": 75
}
```

## Workflow Ideas

- **Smart Home Automation**: Announce when doors open, lights turn on, etc.
- **Calendar Integration**: Announce upcoming meetings or events
- **Weather Updates**: Send daily weather announcements
- **Security Alerts**: Notify about security system events
- **Timer & Reminders**: Create custom reminder systems
- **Media Control**: Control music based on presence detection

## Configuration Tips

### Getting Device Serial Numbers

Use the "Get Devices" operation to retrieve all available devices and their serial numbers.

### 2FA Setup

If you have 2FA enabled on your Amazon account:

1. In your authenticator app, view the account details
2. Copy the Base32 secret (not the 6-digit code)
3. Enter this secret in the credentials configuration

### Queue Delay

The queue delay parameter helps prevent API rate limiting when sending multiple commands. Adjust based on your needs:
- **1.5s** (default): Good for most use cases
- **0.5s**: For faster responses when needed
- **3s+**: For high-volume operations

## Troubleshooting

### Authentication Issues
- Verify your Amazon credentials are correct
- Check that the correct domain is selected
- If using 2FA, ensure the secret is properly formatted (Base32)
- Try enabling debug mode for more detailed logs

### Device Not Found
- Use "Get Devices" to verify the device serial number
- Ensure the device is online and registered to your account
- Check that the device supports the requested operation

### Rate Limiting
- Increase the queue delay parameter
- Reduce the frequency of operations in your workflow
- Consider batching operations when possible

## Contributing

This package is part of the alexa-nodejs workspace. See the main project for contribution guidelines.

## License

Apache-2.0 License - see the main project LICENSE file for details.

## Related Projects

- [alexa-nodejs](../alexa-nodejs): The core library powering this n8n node
- [AlexaPy](https://github.com/keatontaylor/alexapy): The original Python library

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the examples and documentation
3. Open an issue in the main project repository 