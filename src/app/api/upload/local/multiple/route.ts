// app/api/upload/multiple/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { LocalUploadService } from '@/features/dashboard/services/UploadService'

export async function POST(req: NextRequest) {
  try {
    await requireAuthority({ requiredRole: 'ADMIN' })

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const folder = (formData.get('folder') as string) || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded' },
        { status: 400 },
      )
    }

    const results = []
    const errors = []

    for (const file of files) {
      try {
        const result = await LocalUploadService.uploadFile(file, { folder })
        results.push({
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          mimeType: result.mimeType,
        })
      } catch (error: any) {
        errors.push({
          filename: file.name,
          error: error.message || 'Upload failed',
        })
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'All files failed to upload', errors },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Multiple upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 },
    )
  }
}