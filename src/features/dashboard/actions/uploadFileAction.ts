'use server'

import { FileInput, SingleUploadResponse } from '@/components/types/types'
import { LocalUploadService } from '../services/UploadService'
import { revalidatePath } from 'next/cache'

export async function uploadFileAction(
  input: FileInput,
): Promise<SingleUploadResponse> {
  try {
    const { file, folder = 'general' } = input

    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }

    const result = await LocalUploadService.uploadFile(file, { folder })

    // Revalidate your actual dashboard routes
    revalidatePath('/dashboard/addProduct')
    revalidatePath('/dashboard/addBlog')

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
    return { success: false, error: error.message }
  }
}
