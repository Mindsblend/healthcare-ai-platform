import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/upload/route'

const { requireAuthority, uploadStream } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  uploadStream: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/lib/cloudinary', () => ({
  default: {
    uploader: {
      upload_stream: uploadStream,
    },
  },
}))

describe('POST /api/upload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    requireAuthority.mockResolvedValue({ id: 'admin-1' })
  })

  function createRequest(file?: File) {
    const formData = new FormData()
    if (file) formData.append('file', file)

    return new Request('http://localhost/api/upload', {
      method: 'POST',
      body: formData,
    }) as never
  }

  it('uploads a file to Cloudinary and returns its URL', async () => {
    const file = new File(['image-data'], 'rug.png', {
      type: 'image/png',
    })

    uploadStream.mockImplementation(
      (
        options: { folder: string },
        callback: (error: Error | null, result?: { secure_url: string }) => void,
      ) => {
        expect(options).toEqual({ folder: 'products' })

        return {
          end: (buffer: Buffer) => {
            expect(buffer.toString()).toBe('image-data')
            callback(null, { secure_url: 'https://cdn.example.com/rug.png' })
          },
        }
      },
    )

    const response = await POST(createRequest(file))

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(uploadStream).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      url: 'https://cdn.example.com/rug.png',
    })
  })

  it('propagates authorization failure without uploading', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    await expect(POST(createRequest(
      new File(['data'], 'rug.png', { type: 'image/png' }),
    ))).rejects.toThrow('Forbidden')

    expect(uploadStream).not.toHaveBeenCalled()
  })

  it('returns 400 when no file is uploaded', async () => {
    const response = await POST(createRequest())

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'No file uploaded',
    })
    expect(uploadStream).not.toHaveBeenCalled()
  })

  it('returns 500 when Cloudinary reports an upload error', async () => {
    uploadStream.mockImplementation(
      (
        _options: { folder: string },
        callback: (error: Error | null, result?: { secure_url: string }) => void,
      ) => ({
        end: () => callback(new Error('Cloudinary unavailable')),
      }),
    )

    const response = await POST(createRequest(
      new File(['data'], 'rug.png', { type: 'image/png' }),
    ))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Upload failed',
    })
    expect(console.error).toHaveBeenCalled()
  })
})