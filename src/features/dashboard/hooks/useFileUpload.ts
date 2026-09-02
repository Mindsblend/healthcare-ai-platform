import { useState } from 'react'
import { uploadFileAction } from '../actions/uploadFileAction'
import { UploadState, UploadResult, FileInput } from '@/components/types/types'

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const uploadFile = async (
    file: File,
    folder?: string,
  ): Promise<UploadResult | null> => {
    setState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
    })

    try {
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }))
      }, 200)

      // Use the FileInput type
      const input: FileInput = {
        file: file,
        folder: folder || 'products',
        filename: file.name,
      }

      // Create FormData from the input
      const formData = new FormData()
      formData.append('file', input.file)
      formData.append('folder', input.folder)
      formData.append('filename', input.filename)

      const result = await uploadFileAction(formData)

      clearInterval(progressInterval)

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
    uploadFile,
    reset,
  }
}
