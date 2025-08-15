#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import pkg from '../package.json' with { type: 'json' }
import { syncCommand } from './commands/sync'

// AI-DEV-NOTE: Main CLI entry point using Commander.js
const program = new Command()

// AI-DEV-NOTE: Configure the CLI program metadata
program
  .name('aib')
  .description('AI Ecosystem CLI - Enhancing the AI ecosystem')
  .version(pkg.version)

// AI-DEV-NOTE: Add version command alias
program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log(`aib v${program.version()}`)
  })

// AI-DEV-NOTE: Add sync command to sync cursor rules from GitHub repository
program
  .command('sync')
  .description('Sync cursor rules from aibetter/context repository')
  .option('-f, --force', 'Force overwrite existing files')
  .option('-d, --dry-run', 'Show what would be synced without actually doing it')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    await syncCommand({
      force: options.force,
      dryRun: options.dryRun,
      verbose: options.verbose,
    })
  })

// AI-DEV-NOTE: Parse command line arguments and execute commands
program.parse(process.argv)

// AI-DEV-NOTE: Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
