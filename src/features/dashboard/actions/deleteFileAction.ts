import { DeleteFileInput, DeleteUploadResponse } from '@/components/types/types'

export async function deleteFileAction(
  input: DeleteFileInput,
): Promise<DeleteUploadResponse> {
  try {
    const { folder, filename } = input

    if (!folder || !filename) {
      return { success: false, error: 'Folder and filename are required' }
    }

    // Call the API route
    const response = await fetch(
      `/api/upload/delete?folder=${folder}&filename=${filename}`,
      {
        method: 'DELETE',
      },
    )

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Delete failed' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Delete file error:', error)
    return { success: false, error: error.message || 'Failed to delete file' }
  }
}
