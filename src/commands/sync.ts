import type { AibetterConfig } from '../utils/config'
import { promises as fs } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import chalk from 'chalk'
import { ensureDir, pathExists } from 'fs-extra'
import {
  getDestination,
  getEnabledRules,
  getRepositoryConfig,
  loadAibetterConfig,
  resolveDestinationPath,
  shouldOverwriteFiles,
} from '../utils/config'
import { LOG_PREFIX } from '../utils/constants'
import { DownloadService } from '../utils/download'

export interface SyncOptions {
  // AI-DEV-NOTE: Force overwrite existing files
  force?: boolean
  // AI-DEV-NOTE: Dry run mode - show what would be synced without actually doing it
  dryRun?: boolean
  // AI-DEV-NOTE: Verbose output
  verbose?: boolean
}

// AI-DEV-NOTE: Main sync command implementation
export class SyncCommand {
  private readonly downloadService: DownloadService
  private config: AibetterConfig | null = null

  constructor() {
    this.downloadService = new DownloadService()
  }

  /**
   * AI-DEV-NOTE: Execute sync command with given options
   * @param options Sync command options
   */
  async execute(options: SyncOptions = {}): Promise<void> {
    try {
      console.log(LOG_PREFIX, chalk.blue('🔄 Starting sync process...'))

      // AI-DEV-NOTE: Load configuration
      this.config = await loadAibetterConfig()

      // AI-DEV-NOTE: Get configuration values
      const repository = getRepositoryConfig()
      const destination = getDestination(this.config)
      const overwrite = shouldOverwriteFiles(this.config)
      const shouldOverwrite = options.force || overwrite

      if (options.verbose) {
        console.log(LOG_PREFIX, chalk.gray(`Repository: ${repository.owner}/${repository.repo}`))
        console.log(LOG_PREFIX, chalk.gray(`Source path: ${repository.path}`))
        console.log(LOG_PREFIX, chalk.gray(`Destination: ${destination}`))
        console.log(LOG_PREFIX, chalk.gray(`Reference: ${repository.ref}`))
      }

      // AI-DEV-NOTE: Ensure destination directory exists
      const destinationPath = resolveDestinationPath(destination)

      if (options.dryRun) {
        console.log(LOG_PREFIX, chalk.yellow(`[DRY RUN] Would sync to: ${destinationPath}`))
      }
      else {
        await ensureDir(destinationPath)
      }

      // AI-DEV-NOTE: Get selected files based on cursor.rules configuration
      console.log(LOG_PREFIX, chalk.blue('📡 Fetching specified rules from GitHub...'))
      const filesToSync = await this.getSelectedFiles(repository)

      if (filesToSync.length === 0) {
        console.log(LOG_PREFIX, chalk.yellow('⚠️  No enabled rules found to sync'))
        return
      }

      console.log(LOG_PREFIX, chalk.green(`📦 Found ${filesToSync.length} files to sync`))

      // AI-DEV-NOTE: Download and save files
      let syncedCount = 0
      let skippedCount = 0

      for (const { content, targetPath, sourcePath } of filesToSync) {
        const localPath = join(destinationPath, targetPath)

        // AI-DEV-NOTE: Check if file already exists
        const fileExists = await pathExists(localPath)

        if (fileExists && !shouldOverwrite && !options.dryRun) {
          if (options.verbose) {
            console.log(LOG_PREFIX, chalk.gray(`⏭️  Skipping existing file: ${targetPath}`))
          }
          skippedCount++
          continue
        }

        if (options.dryRun) {
          const sourceNote = targetPath !== sourcePath ? ` (from ${sourcePath})` : ''
          console.log(LOG_PREFIX, chalk.yellow(`[DRY RUN] Would sync: ${targetPath}${sourceNote}`))
          syncedCount++
          continue
        }

        try {
          // AI-DEV-NOTE: Ensure parent directory exists
          await ensureDir(dirname(localPath))

          // AI-DEV-NOTE: Write file to local destination
          await fs.writeFile(localPath, content, 'utf-8')

          if (options.verbose) {
            const aliasNote = targetPath !== sourcePath ? ` (aliased from ${sourcePath})` : ''
            console.log(LOG_PREFIX, chalk.green(`✅ Synced: ${targetPath}${aliasNote}`))
          }

          syncedCount++
        }
        catch (error) {
          console.error(LOG_PREFIX, chalk.red(`❌ Failed to sync ${targetPath}: ${error}`))
        }
      }

      // AI-DEV-NOTE: Display summary
      if (options.dryRun) {
        console.log(LOG_PREFIX, chalk.blue(`\n🔍 Dry run completed:`))
        console.log(LOG_PREFIX, chalk.green(`  📦 ${syncedCount} files would be synced`))
      }
      else {
        console.log(LOG_PREFIX, chalk.blue(`\n✨ Sync completed:`))
        console.log(LOG_PREFIX, chalk.green(`  📦 ${syncedCount} files synced`))
        if (skippedCount > 0) {
          console.log(LOG_PREFIX, chalk.yellow(`  ⏭️  ${skippedCount} files skipped (already exist)`))
        }
        console.log(LOG_PREFIX, chalk.gray(`  📍 Destination: ${relative(process.cwd(), destinationPath)}`))
      }
    }
    catch (error) {
      console.error(LOG_PREFIX, chalk.red('❌ Sync failed:'), error)
      process.exit(1)
    }
  }

  /**
   * AI-DEV-NOTE: Get selected files based on cursor.rules configuration
   */
  private async getSelectedFiles(repository: { owner: string, repo: string, path: string, ref: string }): Promise<Array<{ content: string, targetPath: string, sourcePath: string }>> {
    if (!this.config) {
      throw new Error('Configuration not loaded')
    }

    const enabledRules = getEnabledRules(this.config)
    const filesToSync: Array<{ content: string, targetPath: string, sourcePath: string }> = []

    for (const rule of enabledRules) {
      try {
        // AI-DEV-NOTE: Construct full GitHub path
        const fullPath = `${repository.path}/${rule.source}`

        // AI-DEV-NOTE: Download file content directly using raw URL
        const content = await this.downloadService.downloadFile(
          repository.owner,
          repository.repo,
          fullPath,
          repository.ref,
        )

        filesToSync.push({
          content,
          targetPath: rule.target,
          sourcePath: rule.source,
        })
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes('File not found (404)')) {
          console.warn(LOG_PREFIX, chalk.yellow(`⚠️  ${errorMessage}`))
        }
        else {
          console.warn(LOG_PREFIX, chalk.yellow(`⚠️  Failed to fetch rule: ${rule.source} - ${errorMessage}`))
        }
      }
    }

    return filesToSync
  }
}

/**
 * AI-DEV-NOTE: Factory function to create and execute sync command
 * @param options Sync command options
 */
export async function syncCommand(options: SyncOptions = {}): Promise<void> {
  const command = new SyncCommand()
  await command.execute(options)
}
