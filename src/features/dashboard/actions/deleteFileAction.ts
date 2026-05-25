import { LocalUploadService } from '../services/UploadService'
import { FileInput, DeleteUploadResponse } from '@/components/types/types'
import { revalidatePath } from 'next/cache'

export async function deleteFileAction(
  input: FileInput,
): Promise<DeleteUploadResponse> {
  const { folder, filename } = input

  try {
    const deleted = await LocalUploadService.deleteFile(folder, filename)

    if (!deleted) {
      return { success: false, error: 'File not found' }
    }

    // Revalidate your actual dashboard routes
    revalidatePath('/dashboard/addProduct')
    revalidatePath('/dashboard/addBlog')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
