import { resolve } from 'node:path'
import { loadConfig } from 'c12'

export interface RuleConfig {
  // AI-DEV-NOTE: Custom alias path for the rule (relative to .cursor/rules/)
  alias?: string
}

// AI-DEV-NOTE: Recursive type for nested rule configuration
export type RuleValue = boolean | RuleConfig | NestedRules

export interface NestedRules {
  [key: string]: RuleValue
}

export interface RepositoryConfig {
  owner: string
  repo: string
  path: string
  ref?: string
}

export interface AibetterConfig {
  // AI-DEV-NOTE: Cursor-related configuration
  cursor: {
    // AI-DEV-NOTE: Rules configuration for selective sync (supports nested structure)
    rules: NestedRules
    // AI-DEV-NOTE: Local destination path for synced files
    destination?: string
    // AI-DEV-NOTE: Whether to overwrite existing files
    overwrite?: boolean
  }
}

// AI-DEV-NOTE: Fixed repository configuration (hard-coded)
const REPOSITORY_CONFIG: RepositoryConfig & { ref: string } = {
  owner: 'aibetter',
  repo: 'context',
  path: 'data/cursor/rules',
  ref: 'main',
}

// AI-DEV-NOTE: Default configuration values
const DEFAULT_CONFIG: AibetterConfig = {
  cursor: {
    rules: {},
    destination: '.cursor/rules',
    overwrite: true,
  },
}

/**
 * AI-DEV-NOTE: Load aibetter.json configuration using c12
 * @param cwd Current working directory (default: process.cwd())
 * @returns Merged configuration with defaults
 */
export async function loadAibetterConfig(cwd?: string): Promise<AibetterConfig> {
  try {
    const { config } = await loadConfig<AibetterConfig>({
      name: 'aibetter',
      cwd: cwd || process.cwd(),
      // AI-DEV-NOTE: Look for aibetter.json, aibetter.config.js, etc.
      configFile: 'aibetter.json',
      defaults: DEFAULT_CONFIG,
    })

    const mergedConfig = config || DEFAULT_CONFIG

    // AI-DEV-NOTE: Validate that cursor.rules is configured
    if (!mergedConfig.cursor?.rules || Object.keys(mergedConfig.cursor.rules).length === 0) {
      throw new Error('No cursor rules configured. Please add rules to cursor.rules in aibetter.json')
    }

    return mergedConfig
  }
  catch (error) {
    throw new Error(`Failed to load aibetter.json config: ${error}`)
  }
}

/**
 * AI-DEV-NOTE: Get absolute path for destination directory
 * @param destination Relative or absolute destination path
 * @param cwd Current working directory
 */
export function resolveDestinationPath(destination: string, cwd?: string): string {
  const workingDir = cwd || process.cwd()
  return resolve(workingDir, destination)
}

/**
 * AI-DEV-NOTE: Normalize file path by adding .mdc extension if not present
 * @param path File path
 * @returns Path with .mdc extension
 */
function normalizeFilePath(path: string): string {
  return path.endsWith('.mdc') ? path : `${path}.mdc`
}

/**
 * AI-DEV-NOTE: Flatten nested rules configuration to flat path-based structure
 * @param rules Nested rules configuration
 * @param parentPath Current parent path for recursion
 * @returns Flattened rules object
 */
function flattenRules(rules: NestedRules, parentPath = ''): { [path: string]: boolean | RuleConfig } {
  const flattened: { [path: string]: boolean | RuleConfig } = {}

  for (const [key, value] of Object.entries(rules)) {
    const currentPath = parentPath ? `${parentPath}/${key}` : key

    if (typeof value === 'boolean' || (typeof value === 'object' && value !== null && 'alias' in value)) {
      // AI-DEV-NOTE: Terminal value (boolean or RuleConfig)
      flattened[currentPath] = value
    }
    else if (typeof value === 'object' && value !== null) {
      // AI-DEV-NOTE: Nested object - recurse
      const nestedFlattened = flattenRules(value as NestedRules, currentPath)
      Object.assign(flattened, nestedFlattened)
    }
  }

  return flattened
}

/**
 * AI-DEV-NOTE: Get enabled rules from configuration
 * @param config Aibetter configuration
 * @returns Array of enabled rule paths with their target paths
 */
export function getEnabledRules(config: AibetterConfig): Array<{ source: string, target: string }> {
  // AI-DEV-NOTE: First flatten the nested rules structure
  const flattenedRules = flattenRules(config.cursor.rules)
  const enabledRules: Array<{ source: string, target: string }> = []

  for (const [rulePath, ruleConfig] of Object.entries(flattenedRules)) {
    // AI-DEV-NOTE: Skip disabled rules (false values)
    if (ruleConfig === false) {
      continue
    }

    // AI-DEV-NOTE: Normalize source path to include .mdc extension
    const sourcePath = normalizeFilePath(rulePath)
    let targetPath = normalizeFilePath(rulePath)

    // AI-DEV-NOTE: Handle object configuration with alias
    if (typeof ruleConfig === 'object' && ruleConfig.alias) {
      targetPath = normalizeFilePath(ruleConfig.alias)
    }

    enabledRules.push({
      source: sourcePath,
      target: targetPath,
    })
  }

  return enabledRules
}

/**
 * AI-DEV-NOTE: Get repository configuration (hard-coded)
 * @returns Repository configuration with required ref
 */
export function getRepositoryConfig(): RepositoryConfig & { ref: string } {
  return REPOSITORY_CONFIG
}

/**
 * AI-DEV-NOTE: Get destination path from configuration
 * @param config Aibetter configuration
 * @returns Destination path
 */
export function getDestination(config: AibetterConfig): string {
  return config.cursor.destination || '.cursor/rules'
}

/**
 * AI-DEV-NOTE: Get overwrite setting from configuration
 * @param config Aibetter configuration
 * @returns Whether to overwrite existing files
 */
export function shouldOverwriteFiles(config: AibetterConfig): boolean {
  return config.cursor.overwrite ?? true
}
