import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { AlexaLogin, AlexaAPI } from 'alexa-nodejs';

export class Alexa implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Alexa',
    name: 'alexa',
    icon: 'file:alexa.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with Amazon Alexa devices',
    defaults: {
      name: 'Alexa',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'alexaApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Devices',
            value: 'getDevices',
            description: 'Get all Alexa devices',
            action: 'Get all devices',
          },
          {
            name: 'Send TTS',
            value: 'sendTTS',
            description: 'Send text-to-speech to device',
            action: 'Send text to speech',
          },
          {
            name: 'Send Announcement',
            value: 'sendAnnouncement',
            description: 'Send announcement to device(s)',
            action: 'Send announcement',
          },
          {
            name: 'Set Volume',
            value: 'setVolume',
            description: 'Set device volume',
            action: 'Set volume',
          },
          {
            name: 'Play Media',
            value: 'play',
            description: 'Play media on device',
            action: 'Play media',
          },
          {
            name: 'Pause Media',
            value: 'pause',
            description: 'Pause media on device',
            action: 'Pause media',
          },
          {
            name: 'Stop Media',
            value: 'stop',
            description: 'Stop media on device',
            action: 'Stop media',
          },
          {
            name: 'Next Track',
            value: 'next',
            description: 'Skip to next track',
            action: 'Skip to next track',
          },
          {
            name: 'Previous Track',
            value: 'previous',
            description: 'Go to previous track',
            action: 'Go to previous track',
          },
          {
            name: 'Get Device State',
            value: 'getState',
            description: 'Get current device state',
            action: 'Get device state',
          },
          {
            name: 'Get Activities',
            value: 'getActivities',
            description: 'Get recent activities',
            action: 'Get activities',
          },
          {
            name: 'Send Sequence',
            value: 'sendSequence',
            description: 'Send custom sequence command',
            action: 'Send sequence',
          },
        ],
        default: 'getDevices',
      },

      // Device Selection
      {
        displayName: 'Device Serial Number',
        name: 'deviceSerial',
        type: 'string',
        displayOptions: {
          hide: {
            operation: ['getDevices', 'getActivities'],
          },
        },
        default: '',
        placeholder: 'G000FL0123456789',
        description: 'The serial number of the target Alexa device',
      },

      // TTS Options
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendTTS', 'sendAnnouncement'],
          },
        },
        default: '',
        placeholder: 'Hello from n8n!',
        description: 'The message to speak',
        required: true,
      },

      // Announcement Options
      {
        displayName: 'Announcement Method',
        name: 'announcementMethod',
        type: 'options',
        displayOptions: {
          show: {
            operation: ['sendAnnouncement'],
          },
        },
        options: [
          { name: 'All Devices', value: 'all' },
          { name: 'Spoken', value: 'spoken' },
        ],
        default: 'all',
        description: 'How to deliver the announcement',
      },

      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendAnnouncement'],
          },
        },
        default: 'Announcement',
        description: 'Title for the announcement',
      },

      // Volume Options
      {
        displayName: 'Volume',
        name: 'volume',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['setVolume'],
          },
        },
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
        default: 50,
        description: 'Volume level (0-100)',
        required: true,
      },

      // Sequence Options
      {
        displayName: 'Sequence',
        name: 'sequence',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendSequence'],
          },
        },
        default: '',
        placeholder: 'PREVIEW:Alexa.DeviceControls.Play',
        description: 'The sequence command to send',
        required: true,
      },

      // Activities Options
      {
        displayName: 'Items Count',
        name: 'itemsCount',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['getActivities'],
          },
        },
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 10,
        description: 'Number of activities to retrieve',
      },

      // General Options
      {
        displayName: 'Queue Delay (seconds)',
        name: 'queueDelay',
        type: 'number',
        displayOptions: {
          hide: {
            operation: ['getDevices', 'getActivities', 'getState'],
          },
        },
        typeOptions: {
          minValue: 0,
          maxValue: 10,
          numberPrecision: 1,
        },
        default: 1.5,
        description: 'Delay between commands in seconds',
      },

      // Target Devices for Multi-device Operations
      {
        displayName: 'Target Devices',
        name: 'targets',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendTTS', 'sendAnnouncement'],
          },
        },
        default: '',
        placeholder: 'G000FL0123456789,G000FL0987654321',
        description: 'Comma-separated list of device serial numbers. Leave empty to use the main device.',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Get credentials
    const credentials = await this.getCredentials('alexaApi');
    
    // Create output path function (using temp directory)
    const outputPath = (filename: string) => `/tmp/alexa-n8n/${filename}`;

    // Initialize login
    const login = new AlexaLogin(
      credentials.domain as string,
      credentials.email as string,
      credentials.password as string,
      outputPath,
      credentials.debug as boolean || false,
      credentials.otpSecret as string || '',
      {}, // oauth tokens
      undefined, // uuid
      true // oauth login
    );

    try {
      // Perform login
      await login.login();
      
      for (let i = 0; i < items.length; i++) {
        const operation = this.getNodeParameter('operation', i) as string;
        
        let result: any = {};

        switch (operation) {
          case 'getDevices':
            result = await AlexaAPI.getDevices(login);
            break;

          case 'getActivities':
            const itemsCount = this.getNodeParameter('itemsCount', i) as number;
            result = await AlexaAPI.getActivities(login, itemsCount);
            break;

          case 'sendTTS':
          case 'sendAnnouncement':
          case 'setVolume':
          case 'play':
          case 'pause':
          case 'stop':
          case 'next':
          case 'previous':
          case 'getState':
          case 'sendSequence':
            // These operations require a device
            const deviceSerial = this.getNodeParameter('deviceSerial', i) as string;
            
            if (!deviceSerial) {
              throw new NodeOperationError(this.getNode(), 'Device serial number is required for this operation');
            }

            // Create a device object (simplified)
            const device = {
              serialNumber: deviceSerial,
              deviceType: 'ECHO', // This should ideally be fetched from device list
              deviceFamily: 'ECHO',
            };

            const api = new AlexaAPI(device, login);

            switch (operation) {
              case 'sendTTS':
                const ttsMessage = this.getNodeParameter('message', i) as string;
                const ttsTargets = this.getNodeParameter('targets', i) as string;
                const ttsQueueDelay = this.getNodeParameter('queueDelay', i) as number;
                
                const ttsTargetArray = ttsTargets ? ttsTargets.split(',').map(s => s.trim()) : undefined;
                await api.sendTTS(ttsMessage, undefined, ttsTargetArray, ttsQueueDelay);
                result = { success: true, message: 'TTS sent successfully' };
                break;

              case 'sendAnnouncement':
                const announcementMessage = this.getNodeParameter('message', i) as string;
                const announcementMethod = this.getNodeParameter('announcementMethod', i) as string;
                const announcementTitle = this.getNodeParameter('title', i) as string;
                const announcementTargets = this.getNodeParameter('targets', i) as string;
                const announcementQueueDelay = this.getNodeParameter('queueDelay', i) as number;
                
                const announcementTargetArray = announcementTargets ? announcementTargets.split(',').map(s => s.trim()) : undefined;
                await api.sendAnnouncement(
                  announcementMessage,
                  announcementMethod,
                  announcementTitle,
                  undefined,
                  announcementTargetArray,
                  announcementQueueDelay
                );
                result = { success: true, message: 'Announcement sent successfully' };
                break;

              case 'setVolume':
                const volume = this.getNodeParameter('volume', i) as number;
                const volumeQueueDelay = this.getNodeParameter('queueDelay', i) as number;
                await api.setVolume(volume, undefined, volumeQueueDelay);
                result = { success: true, message: `Volume set to ${volume}` };
                break;

              case 'play':
                await api.play();
                result = { success: true, message: 'Play command sent' };
                break;

              case 'pause':
                await api.pause();
                result = { success: true, message: 'Pause command sent' };
                break;

              case 'stop':
                const stopQueueDelay = this.getNodeParameter('queueDelay', i) as number;
                await api.stop(undefined, stopQueueDelay);
                result = { success: true, message: 'Stop command sent' };
                break;

              case 'next':
                await api.next();
                result = { success: true, message: 'Next track command sent' };
                break;

              case 'previous':
                await api.previous();
                result = { success: true, message: 'Previous track command sent' };
                break;

              case 'getState':
                result = await api.getState();
                break;

              case 'sendSequence':
                const sequence = this.getNodeParameter('sequence', i) as string;
                const sequenceQueueDelay = this.getNodeParameter('queueDelay', i) as number;
                await api.sendSequence(sequence, undefined, sequenceQueueDelay);
                result = { success: true, message: 'Sequence sent successfully' };
                break;
            }
            break;

          default:
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
        }

        returnData.push({
          json: {
            operation,
            ...result,
          },
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new NodeOperationError(this.getNode(), `Alexa operation failed: ${errorMessage}`);
    } finally {
      // Clean up
      await login.close();
    }

    return [returnData];
  }
} 