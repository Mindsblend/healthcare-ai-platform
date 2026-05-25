// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { LocalUploadService } from '@/features/dashboard/services/UploadService'

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    await requireAuthority({ requiredRole: 'ADMIN' })

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    // Upload using service
    const result = await LocalUploadService.uploadFile(file, { folder })

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        filename: result.filename,
        originalName: result.originalName,
        size: result.size,
        mimeType: result.mimeType,
      },
    })
  } catch (error: any) {
    console.error('Upload error:', error)

    if (
      error.message.includes('size exceeds') ||
      error.message.includes('Invalid file format')
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuthority({ requiredRole: 'ADMIN' })

    const { searchParams } = new URL(req.url)
    const folder = searchParams.get('folder')
    const filename = searchParams.get('filename')

    if (!folder || !filename) {
      return NextResponse.json(
        { error: 'Folder and filename required' },
        { status: 400 },
      )
    }

    const deleted = await LocalUploadService.deleteFile(folder, filename)

    if (!deleted) {
      return NextResponse.json(
        { error: 'File not found or could not be deleted' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
