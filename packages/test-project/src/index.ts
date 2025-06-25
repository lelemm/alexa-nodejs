/**
 * Test project for alexa-nodejs library
 * 
 * This demonstrates how to use the alexa-nodejs library
 */

import { config } from 'dotenv';
import { AlexaLogin, AlexaAPI, AlexaDevice } from 'alexa-nodejs';

// Load environment variables
config();

async function main() {
  try {
    console.log('🚀 Starting Alexa NodeJS Test Application');
    
    // Configuration from environment variables
    const email = process.env.ALEXA_EMAIL;
    const password = process.env.ALEXA_PASSWORD;
    const otpSecret = process.env.ALEXA_OTP_SECRET;
    const domain = process.env.ALEXA_DOMAIN || 'amazon.com';
    
    if (!email || !password) {
      console.error('❌ Please set ALEXA_EMAIL and ALEXA_PASSWORD environment variables');
      process.exit(1);
    }
    
    console.log(`📧 Email: ${email.substring(0, 3)}***`);
    console.log(`🌐 Domain: ${domain}`);
    
    // Create output path function
    const outputPath = (filename: string) => `./storage/${filename}`;
    
    // Create login instance
    console.log('🔐 Creating login instance...');
    const login = new AlexaLogin(
      domain,
      email,
      password,
      outputPath,
      true, // debug mode
      otpSecret || '',
      {}, // oauth tokens
      undefined, // uuid
      true // oauth login
    );
    
    // Test login
    console.log('🔄 Testing login...');
    const isLoggedIn = await login.testLoggedIn();
    console.log(`Login status: ${isLoggedIn ? '✅ Logged in' : '❌ Not logged in'}`);
    
    if (!isLoggedIn) {
      console.log('🔑 Attempting to log in...');
<<<<<<< HEAD
      try {
        await login.login();
        console.log('✅ Login successful!');
      } catch (error) {
        console.error('❌ Login failed:', error);
        console.log('⚠️  Continuing with existing session state...');
      }
=======
      await login.login();
      console.log('✅ Login successful!');
>>>>>>> origin/main
    }
    
    // Get devices
    console.log('📱 Getting devices...');
    const devices = await AlexaAPI.getDevices(login);
    
    // Type guard to check if devices has the expected structure
    const deviceList = devices && typeof devices === 'object' && 'devices' in devices 
      ? devices.devices as Array<{
          accountName: string;
          deviceType: string;
          deviceFamily: string;
          serialNumber: string;
        }>
      : [];
    
    if (deviceList && deviceList.length > 0) {
      console.log(`📱 Found ${deviceList.length} devices:`);
      
      deviceList.forEach((device, index: number) => {
        console.log(`  ${index + 1}. ${device.accountName} (${device.deviceType}) - ${device.serialNumber}`);
      });
      
      // Use the first device for testing
      const firstDevice: AlexaDevice = {
        serialNumber: deviceList[0].serialNumber,
        deviceType: deviceList[0].deviceType,
        deviceFamily: deviceList[0].deviceFamily
      };
      
      // Create API instance
      const alexaAPI = new AlexaAPI(firstDevice, login);
      
      // Test TTS
      console.log('🗣️  Testing Text-to-Speech...');
      await alexaAPI.sendTTS('Hello from the Node.js Alexa library!');
      console.log('✅ TTS sent successfully!');
      
      // Test volume control
      console.log('🔊 Testing volume control...');
      await alexaAPI.setVolume(50);
      console.log('✅ Volume set to 50!');
      
      // Test getting device state
      console.log('📊 Getting device state...');
      const state = await alexaAPI.getState();
      if (state) {
        console.log('📊 Device state:', JSON.stringify(state, null, 2));
      }
      
    } else {
      console.log('❌ No devices found');
    }
    
    console.log('🎉 Test completed successfully!');
<<<<<<< HEAD
    process.exit(0);
=======
    
>>>>>>> origin/main
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

<<<<<<< HEAD
// // Handle graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n👋 Shutting down gracefully...');
//   process.exit(0);
// });
=======
// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
>>>>>>> origin/main

// Run the main function
main().catch(console.error); 