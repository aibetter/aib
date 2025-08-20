# aib

[![npm version](https://img.shields.io/npm/v/@aibetter/aib.svg)](https://www.npmjs.com/package/@aibetter/aib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI Ecosystem CLI - Enhancing the AI ecosystem

## Overview

`aib` is a command-line tool designed to enhance the AI development ecosystem by providing utilities to sync and manage AI development configurations and rules.

## Installation

### Global Installation (Recommended)

```bash
# Using npm
npm install -g @aibetter/aib

# Using pnpm
pnpm add -g @aibetter/aib

# Using yarn
yarn global add @aibetter/aib
```

### Local Installation

```bash
# Using npm
npm install @aibetter/aib

# Using pnpm
pnpm add @aibetter/aib

# Using yarn
yarn add @aibetter/aib
```

## Usage

### Basic Commands

```bash
# Show help information
aib --help

# Show version information
aib version
aib --version
```

### Sync Command

The sync command allows you to synchronize cursor rules to your local project.

#### Data Source

The sync command retrieves rules from the community-maintained repository: [https://github.com/aibetter/context/tree/main/data](https://github.com/aibetter/context/tree/main/data)

This repository contains curated cursor rules and configurations that help improve AI-assisted development workflows.

```bash
# Basic sync
aib sync

# Force overwrite existing files
aib sync --force

# Dry run (show what would be synced without actually doing it)
aib sync --dry-run

# Verbose output
aib sync --verbose

# Combine options
aib sync --force --verbose
```

#### Sync Options

- `-f, --force` - Force overwrite existing files
- `-d, --dry-run` - Show what would be synced without actually doing it
- `-v, --verbose` - Enable verbose output

> [!NOTE]
> When you run the sync command, it will display the data source URL at the beginning to show where the rules are being fetched from.

## Configuration

The tool uses an `aibetter.json` configuration file to determine which rules to sync and where to place them. This file follows a JSON schema for validation and provides IntelliSense support in modern editors.

### Configuration Schema

The configuration schema is available at: `http://aib.aibetter.run/config-schema.json`

To enable schema validation in your editor, add the `$schema` property to your `aibetter.json` file:

```json
{
  "$schema": "http://aib.aibetter.run/config-schema.json",
  "cursor": {
    "rules": {
      "constitution": true
    }
  }
}
```

### Configuration Structure

The configuration file supports the following structure:

#### `cursor` (required)

The main configuration object for Cursor-related synchronization.

##### `cursor.rules` (required)

Defines which rules to sync from the repository. Supports both flat and nested structures:

```json
{
  "cursor": {
    "rules": {
      // Simple boolean values
      "constitution": true,
      "security": false,

      // Nested rules structure
      "languages": {
        "TypeScript": true,
        "Python": true,
        "JavaScript": false
      },

      // Rules with custom aliases
      "performance": {
        "alias": "perf-optimizations"
      },

      // Complex nested structure with aliases
      "frameworks": {
        "React": true,
        "Vue": {
          "alias": "vue-best-practices"
        }
      }
    }
  }
}
```

##### `cursor.destination` (optional)

Specifies the local destination path for synced files. Defaults to `.cursor/rules`.

```json
{
  "cursor": {
    "destination": ".cursor/rules"
  }
}
```

##### `cursor.overwrite` (optional)

Determines whether to overwrite existing files. Defaults to `true`.

```json
{
  "cursor": {
    "overwrite": false
  }
}
```

### Example Configurations

#### Basic Configuration

```json
{
  "$schema": "http://aib.aibetter.run/config-schema.json",
  "cursor": {
    "rules": {
      "constitution": true,
      "languages": {
        "TypeScript": true
      }
    }
  }
}
```

#### Advanced Configuration

```json
{
  "$schema": "http://aib.aibetter.run/config-schema.json",
  "cursor": {
    "rules": {
      "constitution": true,
      "security": true,
      "languages": {
        "TypeScript": true,
        "Python": true,
        "JavaScript": false
      },
      "frameworks": {
        "React": true,
        "Vue": {
          "alias": "vue-best-practices"
        }
      },
      "performance": {
        "alias": "perf-rules"
      }
    },
    "destination": ".cursor/rules",
    "overwrite": false
  }
}
```

#### Custom Destination Configuration

```json
{
  "$schema": "http://aib.aibetter.run/config-schema.json",
  "cursor": {
    "rules": {
      "constitution": true,
      "security": true
    },
    "destination": "ai-config/rules",
    "overwrite": false
  }
}
```

### Schema Features

- **Validation**: The JSON schema provides validation for your configuration file
- **IntelliSense**: Modern editors will provide auto-completion and validation
- **Documentation**: Hover over properties to see descriptions and examples
- **Error Detection**: Invalid configurations will be highlighted in your editor

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Setup

```bash
# Clone the repository
git clone https://github.com/aibetter/aib.git
cd aib

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

### Scripts

- `pnpm dev` - Run in development mode with watch
- `pnpm build` - Build the project
- `pnpm lint` - Lint the code
- `pnpm format` - Format the code
- `pnpm release` - Release a new version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [GitHub Repository](https://github.com/aibetter/aib)
- [npm Package](https://www.npmjs.com/package/@aibetter/aib)
- [Issues](https://github.com/aibetter/aib/issues)
