import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DELETE,
  POST,
} from '@/app/api/upload/local/single/route'

const { requireAuthority, uploadFile, deleteFile } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/dashboard/services/UploadService', () => ({
  LocalUploadService: {
    uploadFile,
    deleteFile,
  },
}))

describe('/api/upload/local/single', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    requireAuthority.mockResolvedValue({ id: 'admin-1' })
  })

  it('uploads a file and returns its metadata', async () => {
    const file = new File(['image-data'], 'rug.png', {
      type: 'image/png',
    })
    const result = {
      url: '/uploads/rug.png',
      filename: 'rug.png',
      originalName: 'rug.png',
      size: file.size,
      mimeType: 'image/png',
    }
    uploadFile.mockResolvedValue(result)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'products')

    const response = await POST(
      new Request('http://localhost/api/upload/local/single', {
        method: 'POST',
        body: formData,
      }) as never,
    )

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(uploadFile).toHaveBeenCalledWith(file, { folder: 'products' })
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: result,
    })
  })

  it('returns 400 when no file is provided', async () => {
    const formData = new FormData()

    const response = await POST(
      new Request('http://localhost/api/upload/local/single', {
        method: 'POST',
        body: formData,
      }) as never,
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'No file uploaded',
    })
    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('returns 400 when the file is empty', async () => {
    const formData = new FormData()
    formData.append('file', new File([], 'empty.png', {
      type: 'image/png',
    }))

    const response = await POST(
      new Request('http://localhost/api/upload/local/single', {
        method: 'POST',
        body: formData,
      }) as never,
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'File is empty',
    })
    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid file formats', async () => {
    const file = new File(['content'], 'file.exe', {
      type: 'application/octet-stream',
    })
    const formData = new FormData()
    formData.append('file', file)
    uploadFile.mockRejectedValue(new Error('Invalid file format'))

    const response = await POST(
      new Request('http://localhost/api/upload/local/single', {
        method: 'POST',
        body: formData,
      }) as never,
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid file format',
    })
  })

  it('returns 500 for unexpected upload failures', async () => {
    const formData = new FormData()
    formData.append(
      'file',
      new File(['content'], 'rug.png', { type: 'image/png' }),
    )
    uploadFile.mockRejectedValue(new Error('Storage unavailable'))

    const response = await POST(
      new Request('http://localhost/api/upload/local/single', {
        method: 'POST',
        body: formData,
      }) as never,
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Upload failed',
    })
  })

  it('deletes a file when folder and filename are provided', async () => {
    deleteFile.mockResolvedValue(true)

    const response = await DELETE(
      new Request(
        'http://localhost/api/upload/local/single?folder=products&filename=rug.png',
        { method: 'DELETE' },
      ) as never,
    )

    expect(deleteFile).toHaveBeenCalledWith('products', 'rug.png')
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
  })

  it('returns 400 when folder or filename is missing', async () => {
    const response = await DELETE(
      new Request(
        'http://localhost/api/upload/local/single?folder=products',
        { method: 'DELETE' },
      ) as never,
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Folder and filename required',
    })
    expect(deleteFile).not.toHaveBeenCalled()
  })

  it('returns 404 when a file cannot be deleted', async () => {
    deleteFile.mockResolvedValue(false)

    const response = await DELETE(
      new Request(
        'http://localhost/api/upload/local/single?folder=products&filename=missing.png',
        { method: 'DELETE' },
      ) as never,
    )

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      error: 'File not found or could not be deleted',
    })
  })
})