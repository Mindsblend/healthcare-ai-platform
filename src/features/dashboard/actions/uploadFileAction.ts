import { SingleUploadResponse } from '@/components/types/types'

export async function uploadFileAction(
  formData: FormData,
): Promise<SingleUploadResponse> {
  try {
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'products'

    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }

    // Call the API route
    const response = await fetch('/api/upload/local/single', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Upload failed' }
    }

    return {
      success: true,
      data: {
        url: result.url,
        filename: result.filename,
        originalName: result.originalName,
        size: result.size,
      },
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return { success: false, error: error.message || 'Upload failed' }
  }
}
