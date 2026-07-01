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
    if (options?.maxFiles && files.length > options.maxFiles) {
      return `Maximum ${options.maxFiles} files allowed`
    }

    for (const file of files) {
      if (options?.maxSize && file.size > options.maxSize) {
        const maxSizeMB = options.maxSize / (1024 * 1024)
        return `File "${file.name}" exceeds ${maxSizeMB}MB limit`
      }

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
      // Use the MultipleFilesInput type
      const input: MultipleFilesInput = {
        files: files,
        folder: folder || 'products',
      }

      // Create FormData from the input
      const formData = new FormData()
      input.files.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('folder', input.folder || 'products')

      const result = await uploadMultipleFilesAction(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
      })

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
