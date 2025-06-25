# alexa-nodejs workspace

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This is a yarn workspace containing the alexa-nodejs library and test project.

Node.js/TypeScript library for controlling Amazon Alexa devices (Echo Dot, etc.) programmatically. This is a migration of the popular [AlexaPy](https://gitlab.com/keatontaylor/alexapy) Python library.

**NOTE:** Alexa has no official API; therefore, this library may stop working at any time without warning.

## Workspace Structure

```
alexa-nodejs/
├── packages/
│   ├── alexa-nodejs/          # Main library package
│   │   ├── src/              # TypeScript source files
│   │   ├── dist/             # Compiled JavaScript output
│   │   ├── package.json      # Library package configuration
│   │   └── README.md         # Library documentation
│   ├── test-project/         # Example usage project
│   │   ├── src/              # Test application source
│   │   ├── package.json      # Test project configuration
│   │   └── .env.example      # Environment configuration template
│   └── n8n-nodes-alexa/      # n8n custom node package
│       ├── src/              # Node and credentials source
│       ├── dist/             # Compiled n8n node output
│       ├── package.json      # n8n package configuration
│       └── README.md         # n8n node documentation
├── package.json              # Workspace configuration
└── yarn.lock                 # Dependency lock file
```

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

This will install dependencies for all packages in the workspace.

### 2. Build the Library

```bash
# Build all packages
yarn build

# Or build just the library
yarn build:lib
```

### 3. Run the Test Project

```bash
# Set up environment variables
cd packages/test-project
cp .env.example .env
# Edit .env with your Amazon credentials

# Run the test project
yarn dev:test
```

## Workspace Scripts

The workspace provides several convenience scripts:

```bash
# Build all packages
yarn build

# Build specific packages
yarn build:lib        # Build the alexa-nodejs library
yarn build:test       # Build the test project
yarn build:n8n        # Build the n8n custom node

# Development mode
yarn dev:lib          # Run library in development mode
yarn dev:test         # Run test project in development mode
yarn dev:n8n          # Run n8n node in development mode

# Package n8n node for distribution
yarn package:n8n      # Create distributable package for n8n

# Clean all build artifacts
yarn clean

# Run tests across all packages
yarn test

# Lint all packages
yarn lint
yarn lint:fix
```

## Packages

### 📦 alexa-nodejs

The main library package containing the TypeScript/Node.js implementation.

- **Location**: `packages/alexa-nodejs/`
- **Purpose**: Main library for controlling Alexa devices
- **Documentation**: See `packages/alexa-nodejs/README.md`

### 🧪 @alexa-nodejs/test-project

Example application demonstrating how to use the alexa-nodejs library.

- **Location**: `packages/test-project/`
- **Purpose**: Test and example usage of the library
- **Usage**: Configure `.env` and run `yarn dev:test`

### 🔄 n8n-nodes-alexa

Custom n8n node for workflow automation with Alexa devices.

- **Location**: `packages/n8n-nodes-alexa/`
- **Purpose**: Integrate Alexa control into n8n workflows
- **Documentation**: See `packages/n8n-nodes-alexa/README.md`
- **Usage**: Install in n8n and configure Amazon credentials

## Development

### Working with the Library

```bash
# Navigate to the library package
cd packages/alexa-nodejs

# Install dependencies (or use yarn install from root)
yarn install

# Build the library
yarn build

# Run in development mode
yarn dev

# Run tests
yarn test

# Lint code
yarn lint
```

### Working with the Test Project

```bash
# Navigate to the test project
cd packages/test-project

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Run the test application
yarn dev
```

### Adding Dependencies

For the library:
```bash
yarn workspace alexa-nodejs add <package-name>
yarn workspace alexa-nodejs add -D <dev-package-name>
```

For the test project:
```bash
yarn workspace @alexa-nodejs/test-project add <package-name>
```

## Publishing

To publish the library to npm:

```bash
# Navigate to the library package
cd packages/alexa-nodejs

# Build and publish
yarn build
npm publish
```

## Features

- 🎯 **Device Control**: Send TTS, announcements, control volume, media playback
- 🔐 **Authentication**: Login with Amazon credentials and 2FA support
- 📱 **Device Management**: Get device information and status
- 🔄 **Sequence Commands**: Execute custom Alexa sequences
- 📊 **Activity Monitoring**: Get recent activities and device states
- 🏠 **Smart Home**: Control Guard mode and other smart home features
- 🛠️ **Yarn Workspaces**: Organized monorepo structure for development
- 📦 **TypeScript**: Full type safety and modern development experience

## Credits

This library is a TypeScript/Node.js migration of the original [AlexaPy](https://gitlab.com/keatontaylor/alexapy) Python library created by:
- Keaton Taylor
- Alan Tse

Originally inspired by [alexa-remote-control](https://github.com/thorsten-gehrig/alexa-remote-control) by Thorsten Gehrig.

## License

[Apache-2.0](LICENSE). By providing a contribution, you agree the contribution is licensed under Apache-2.0.

## Disclaimer

This library is not affiliated with Amazon. Use at your own risk. Amazon may change their APIs at any time, which could break this library. 