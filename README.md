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

The sync command allows you to synchronize cursor rules from the aibetter/context repository to your local project.

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

## Configuration

The tool uses an `aibetter.json` configuration file to determine which rules to sync and where to place them. The configuration allows you to specify:

- Source repository settings
- Destination paths
- Enabled rules
- Overwrite behavior

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
