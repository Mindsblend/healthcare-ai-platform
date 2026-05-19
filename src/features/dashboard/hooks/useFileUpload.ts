// hooks/useUpload.ts
import { useState } from 'react'
import { uploadFileAction } from '../actions/uploadFileAction'
import { UploadState, UploadResult } from '@/components/types/types'

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
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }))
      }, 200)

      // Use FileInput interface instead of FormData
      const result = await uploadFileAction({
        file: file,
        folder: folder || 'general',
        filename: file.name,
      })

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

      // Return the uploaded file data
      if (result.data) {
        return result.data
      }

      return null
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
