# Installation Guide: n8n-nodes-alexa

This guide will help you install and configure the custom Alexa node for n8n.

## Prerequisites

- n8n installed and running
- Amazon account with Alexa devices
- Node.js 16+ (if building from source)

## Installation Methods

### Method 1: Manual Installation (Development)

1. **Clone and Build the Package**
   ```bash
   git clone <your-repo-url>
   cd alexa-nodejs
   yarn install
   yarn build:n8n
   ```

2. **Copy to n8n Custom Nodes Directory**
   ```bash
   # For npm-based n8n installation
   cp -r packages/n8n-nodes-alexa/dist ~/.n8n/custom/
   
   # For Docker installation, mount the custom directory
   # docker run -v ~/.n8n/custom:/home/node/.n8n/custom ...
   ```

3. **Restart n8n**
   ```bash
   n8n start
   # or restart your Docker container
   ```

### Method 2: npm Installation (Future)

When published to npm:

```bash
# Global n8n installation
npm install -g n8n-nodes-alexa

# Docker environment variable
# N8N_CUSTOM_EXTENSIONS=n8n-nodes-alexa
```

### Method 3: n8n Community Nodes (Future)

1. Open n8n web interface
2. Go to **Settings** → **Community Nodes**
3. Search for "alexa" or "n8n-nodes-alexa"
4. Click **Install**

## Configuration

### 1. Set Up Amazon Credentials

1. **In n8n web interface**, go to **Credentials**
2. Click **+ Add Credential**
3. Select **"Alexa API"** from the list
4. Fill in your information:

   | Field | Description | Example |
   |-------|-------------|---------|
   | **Amazon Email** | Your Amazon account email | `user@example.com` |
   | **Amazon Password** | Your Amazon account password | `YourPassword123` |
   | **Amazon Domain** | Your country's Amazon domain | `amazon.com` |
   | **2FA Secret** (Optional) | Base32 secret from authenticator app | `ABCD1234EFGH5678...` |
   | **Debug Mode** | Enable for troubleshooting | `false` |

5. Click **Save**

### 2. Get 2FA Secret (If Enabled)

If you have two-factor authentication enabled:

1. **Google Authenticator**: 
   - Long press on your Amazon entry
   - Select "Export accounts" or view QR code
   - Extract Base32 secret

2. **Authy**:
   - Go to account settings for Amazon
   - Look for "Secret Key" or "Manual Entry Key"

3. **Other Apps**:
   - Look for "Manual setup", "Secret key", or "Base32" options

### 3. Test the Connection

1. Create a new workflow
2. Add the **Alexa** node
3. Select your credentials
4. Choose **"Get Devices"** operation
5. Execute the node to verify connection

## Usage Examples

### Basic Device Control

```json
{
  "operation": "sendTTS",
  "deviceSerial": "G000FL0123456789",
  "message": "Hello from n8n!",
  "queueDelay": 1.5
}
```

### Multi-Device Announcement

```json
{
  "operation": "sendAnnouncement",
  "targets": "G000FL0123456789,G000FL0987654321",
  "message": "Dinner is ready!",
  "title": "Kitchen Alert",
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

## Finding Device Serial Numbers

1. Use the **"Get Devices"** operation to retrieve all devices
2. The response will include `serialNumber` for each device
3. Copy the serial numbers you want to control

Example response:
```json
{
  "devices": [
    {
      "serialNumber": "G000FL0123456789",
      "deviceType": "A1MPSLFC7L5AFK",
      "deviceFamily": "ECHO",
      "accountName": "Living Room Echo"
    }
  ]
}
```

## Troubleshooting

### Authentication Issues

**Problem**: "Login failed" or "Invalid credentials"
- ✅ Verify email and password are correct
- ✅ Check the correct Amazon domain is selected
- ✅ Try logging into Amazon website manually
- ✅ Disable 2FA temporarily to test basic auth

**Problem**: "2FA required but no secret provided"
- ✅ Extract Base32 secret from authenticator app
- ✅ Ensure secret is properly formatted (no spaces/dashes)
- ✅ Try regenerating 2FA setup

### Device Issues

**Problem**: "Device not found" or invalid serial number
- ✅ Use "Get Devices" to verify serial numbers
- ✅ Ensure device is online and connected to wifi
- ✅ Check device is registered to your account

**Problem**: Commands not working
- ✅ Verify device supports the operation (e.g., media controls)
- ✅ Increase queue delay for rate limiting
- ✅ Check if device is busy with other commands

### Rate Limiting

**Problem**: "Too many requests" errors
- ✅ Increase `queueDelay` parameter (try 3-5 seconds)
- ✅ Add delays between workflow executions
- ✅ Reduce frequency of operations

### Debug Mode

Enable debug mode in credentials to get detailed logs:

1. Edit your Alexa API credentials
2. Set **Debug Mode** to `true`
3. Check n8n logs for detailed error messages

## Advanced Configuration

### Custom Sequences

Send custom Alexa sequences for advanced control:

```json
{
  "operation": "sendSequence",
  "deviceSerial": "G000FL0123456789",
  "sequence": "PREVIEW:Alexa.DeviceControls.Play",
  "queueDelay": 2
}
```

Common sequences:
- `PREVIEW:Alexa.DeviceControls.Play`
- `PREVIEW:Alexa.DeviceControls.Pause`
- `PREVIEW:Alexa.Weather.Play`
- `PREVIEW:Alexa.FlashBriefing.Play`

### Docker Environment

For Docker deployments, ensure the custom node is available:

```yaml
# docker-compose.yml
version: '3.1'
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_CUSTOM_EXTENSIONS=n8n-nodes-alexa
    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./custom-nodes:/home/node/.n8n/custom
```

## Support

- **Documentation**: See [README.md](./README.md) for detailed usage
- **Examples**: Check the `examples/` directory
- **Issues**: Report bugs in the main repository
- **Community**: Join n8n community forums for general help

## Next Steps

1. ✅ Install and configure the node
2. ✅ Test with "Get Devices" operation
3. ✅ Try basic TTS or announcement
4. ✅ Explore advanced operations and workflows
5. ✅ Join the community and share your automations! 