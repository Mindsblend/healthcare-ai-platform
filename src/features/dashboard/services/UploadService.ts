import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface UploadOptions {
  folder: string
  allowedFormats?: string[]
  maxSize?: number // in bytes
}

export interface UploadResult {
  url: string
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
}

export class LocalUploadService {
  private static readonly BASE_UPLOAD_DIR = path.join(
    process.cwd(),
    'public',
    'uploads',
  )
  private static readonly DEFAULT_OPTIONS: UploadOptions = {
    folder: 'general',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }

  static async uploadFile(
    file: File,
    customOptions?: Partial<UploadOptions>,
  ): Promise<UploadResult> {
    const options = { ...this.DEFAULT_OPTIONS, ...customOptions }

    // Validate file
    this.validateFile(file, options)

    // Create folder structure
    const uploadDir = path.join(this.BASE_UPLOAD_DIR, options.folder)
    await fs.mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = path.join(uploadDir, uniqueFilename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filePath, buffer)

    // Generate URL path
    const urlPath = `/uploads/${options.folder}/${uniqueFilename}`

    return {
      url: urlPath,
      filename: uniqueFilename,
      originalName: file.name,
      path: filePath,
      size: file.size,
      mimeType: file.type,
    }
  }

  static async uploadMultipleFiles(
    files: File[],
    customOptions?: Partial<UploadOptions>,
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, customOptions),
    )
    return Promise.all(uploadPromises)
  }

  static async deleteFile(folder: string, filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.BASE_UPLOAD_DIR, folder, filename)
      await fs.unlink(filePath)
      return true
    } catch (error) {
      console.error('Delete failed:', error)
      return false
    }
  }

  static async deleteFolder(folder: string): Promise<boolean> {
    try {
      const folderPath = path.join(this.BASE_UPLOAD_DIR, folder)
      await fs.rm(folderPath, { recursive: true, force: true })
      return true
    } catch (error) {
      console.error('Delete folder failed:', error)
      return false
    }
  }

  private static validateFile(file: File, options: UploadOptions): void {
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(
        `File size exceeds ${options.maxSize / (1024 * 1024)}MB limit`,
      )
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (options.allowedFormats && fileExtension) {
      if (!options.allowedFormats.includes(fileExtension)) {
        throw new Error(
          `Invalid file format. Allowed: ${options.allowedFormats.join(', ')}`,
        )
      }
    }
  }
}
