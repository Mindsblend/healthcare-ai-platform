import { DeleteFileInput, DeleteUploadResponse } from '@/components/types/types'
import { LocalUploadService } from '../services/UploadService'

export async function deleteFileAction(
  input: DeleteFileInput, // Change this from FileInput to DeleteFileInput
): Promise<DeleteUploadResponse> {
  try {
    const { folder, filename } = input

    if (!folder) {
      return { success: false, error: 'Folder name is required' }
    }

    if (!filename) {
      return { success: false, error: 'Filename is required' }
    }

    const deleted = await LocalUploadService.deleteFile(folder, filename)

    if (!deleted) {
      return { success: false, error: 'File not found' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Delete file error:', error)
    return { success: false, error: error.message || 'Failed to delete file' }
  }
}
