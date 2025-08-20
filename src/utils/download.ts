import axios from 'axios'
import { LOG_PREFIX } from './constants'

// AI-DEV-NOTE: Simple file download service using GitHub raw URLs
export class DownloadService {
  private readonly baseUrl = 'https://raw.githubusercontent.com'
  private readonly githubUrl = 'https://github.com'

  /**
   * AI-DEV-NOTE: Download file content directly from GitHub raw URL
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param ref Branch or commit ref (default: main)
   * @returns File content as string
   */
  async downloadFile(
    owner: string,
    repo: string,
    path: string,
    ref = 'main',
  ): Promise<string> {
    const url = `${this.baseUrl}/${owner}/${repo}/${ref}/${path}`

    try {
      const response = await axios.get<string>(url, {
        headers: {
          'User-Agent': 'aib-cli',
        },
        responseType: 'text',
        timeout: 10000, // 10 second timeout
      })

      return response.data
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          const githubUrl = this.buildGitHubUrl(owner, repo, path, ref)
          throw new Error(`File not found (404): ${githubUrl}`)
        }
        if (error.response?.status === 403) {
          throw new Error(`Access denied: ${path}`)
        }
        throw new Error(`Download failed for ${path}: ${error.message}`)
      }
      throw new Error(`Download failed for ${path}: ${error}`)
    }
  }

  /**
   * AI-DEV-NOTE: Build GitHub repository URL for browser viewing
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param ref Branch or commit ref (default: main)
   * @returns GitHub repository URL
   */
  private buildGitHubUrl(
    owner: string,
    repo: string,
    path: string,
    ref = 'main',
  ): string {
    return `${this.githubUrl}/${owner}/${repo}/blob/${ref}/${path}`
  }

  /**
   * AI-DEV-NOTE: Check if a file exists by attempting to download it (HEAD request)
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param ref Branch or commit ref (default: main)
   * @returns True if file exists
   */
  async fileExists(
    owner: string,
    repo: string,
    path: string,
    ref = 'main',
  ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${owner}/${repo}/${ref}/${path}`

      await axios.head(url, {
        headers: {
          'User-Agent': 'aib-cli',
        },
        timeout: 5000, // 5 second timeout for existence check
      })

      return true
    }
    catch (error) {
      console.error(LOG_PREFIX, error)
      return false
    }
  }
}
