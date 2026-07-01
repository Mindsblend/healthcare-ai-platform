import { MultipleUploadResponse } from '@/components/types/types'

export async function uploadMultipleFilesAction(
  formData: FormData,
): Promise<MultipleUploadResponse> {
  try {
    const files = formData.getAll('files') as File[]
    const folder = (formData.get('folder') as string) || 'products'

    if (!files || files.length === 0) {
      return { success: false, error: 'No files uploaded' }
    }

    // Call the API route
    const response = await fetch('/api/upload/local/multiple', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Upload failed' }
    }

    return {
      success: true,
      data: result.data || [],
    }
  } catch (error: any) {
    console.error('Multiple upload error:', error)
    return { success: false, error: error.message || 'Upload failed' }
  }
}
