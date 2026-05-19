// actions/uploadMultipleFilesAction.ts
'use server'

import {
  MultipleFilesInput,
  MultipleUploadResponse,
} from '@/components/types/types'
import { LocalUploadService } from '../services/UploadService'
import { revalidatePath } from 'next/cache'

// Version that accepts the interface (recommended)
export async function uploadMultipleFilesAction(
  input: MultipleFilesInput,
): Promise<MultipleUploadResponse> {
  try {
    const { files, folder = 'general' } = input

    if (!files || files.length === 0) {
      return { success: false, error: 'No files uploaded' }
    }

    const results = await LocalUploadService.uploadMultipleFiles(files, {
      folder,
    })

    // Revalidate your actual dashboard routes
    revalidatePath('/dashboard/addProduct')
    revalidatePath('/dashboard/addBlog')

    return {
      success: true,
      data: results.map((r) => ({
        url: r.url,
        filename: r.filename,
        originalName: r.originalName,
        size: r.size,
      })),
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
