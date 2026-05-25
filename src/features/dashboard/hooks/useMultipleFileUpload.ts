// hooks/useMultipleUpload.ts
import { useState } from 'react'
import { uploadMultipleFilesAction } from '../actions/uploadMultipleFilesAction'
import {
  UploadState,
  UploadResult,
  MultipleFilesInput,
  FileInputOptions,
} from '@/components/types/types'

export function useMultipleUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const validateFiles = (
    files: File[],
    options?: FileInputOptions,
  ): string | null => {
    // Check max files
    if (options?.maxFiles && files.length > options.maxFiles) {
      return `Maximum ${options.maxFiles} files allowed`
    }

    // Check each file
    for (const file of files) {
      // Check file size
      if (options?.maxSize && file.size > options.maxSize) {
        const maxSizeMB = options.maxSize / (1024 * 1024)
        return `File "${file.name}" exceeds ${maxSizeMB}MB limit`
      }

      // Check file type
      if (options?.accept) {
        const acceptedTypes = options.accept
          .split(',')
          .map((type) => type.trim())
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
        const fileType = file.type

        const isValidType = acceptedTypes.some((accepted) => {
          if (accepted.startsWith('.')) {
            return fileExtension === accepted.toLowerCase()
          }
          if (accepted.includes('/*')) {
            const mainType = accepted.split('/')[0]
            return fileType.startsWith(mainType)
          }
          return fileType === accepted
        })

        if (!isValidType) {
          return `File "${file.name}" has invalid type. Accepted: ${options.accept}`
        }
      }
    }

    return null
  }

  const uploadMultipleFiles = async (
    files: File[],
    folder?: string,
    options?: FileInputOptions,
  ): Promise<UploadResult[] | null> => {
    // Validate before uploading
    const validationError = validateFiles(files, options)
    if (validationError) {
      setState({
        isUploading: false,
        progress: 0,
        error: validationError,
        success: false,
      })
      return null
    }

    setState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
    })

    try {
      // Use MultipleFilesInput interface
      const input: MultipleFilesInput = {
        files: files,
        folder: folder || 'general',
      }

      const result = await uploadMultipleFilesAction(input)

      if (!result.success) {
        throw new Error(result.error)
      }

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
      })

      // Return the array of uploaded files data
      return result.data || null
    } catch (error: any) {
      setState({
        isUploading: false,
        progress: 0,
        error: error.message,
        success: false,
      })
      return null
    }
  }

  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
    })
  }

  return {
    ...state,
    uploadMultipleFiles,
    validateFiles,
    reset,
  }
}
