import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/upload/local/multiple/route'

const { requireAuthority, uploadFile } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  uploadFile: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/dashboard/services/UploadService', () => ({
  LocalUploadService: {
    uploadFile,
  },
}))

describe('POST /api/upload/local/multiple', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    requireAuthority.mockResolvedValue({ id: 'admin-1' })
  })

  function createRequest(files: File[], folder = 'general') {
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    formData.append('folder', folder)

    return new Request('http://localhost/api/upload/local/multiple', {
      method: 'POST',
      body: formData,
    }) as never
  }

  it('uploads multiple files successfully', async () => {
    const first = new File(['one'], 'one.png', { type: 'image/png' })
    const second = new File(['two'], 'two.png', { type: 'image/png' })

    uploadFile
      .mockResolvedValueOnce({
        url: '/uploads/one.png',
        filename: 'one.png',
        originalName: 'one.png',
        size: first.size,
        mimeType: 'image/png',
      })
      .mockResolvedValueOnce({
        url: '/uploads/two.png',
        filename: 'two.png',
        originalName: 'two.png',
        size: second.size,
        mimeType: 'image/png',
      })

    const response = await POST(createRequest([first, second], 'products'))

    expect(uploadFile).toHaveBeenCalledTimes(2)
    expect(uploadFile).toHaveBeenNthCalledWith(1, first, { folder: 'products' })
    expect(uploadFile).toHaveBeenNthCalledWith(2, second, {
      folder: 'products',
    })
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: [
        { filename: 'one.png', originalName: 'one.png' },
        { filename: 'two.png', originalName: 'two.png' },
      ],
    })
  })

  it('returns 400 when no files are provided', async () => {
    const response = await POST(createRequest([]))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'No files uploaded',
    })
    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('returns successful results and errors when only some uploads fail', async () => {
    const first = new File(['one'], 'one.png', { type: 'image/png' })
    const second = new File(['two'], 'two.png', { type: 'image/png' })

    uploadFile
      .mockResolvedValueOnce({
        url: '/uploads/one.png',
        filename: 'one.png',
        originalName: 'one.png',
        size: first.size,
        mimeType: 'image/png',
      })
      .mockRejectedValueOnce(new Error('Invalid file format'))

    const response = await POST(createRequest([first, second]))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: [
        {
          url: '/uploads/one.png',
          filename: 'one.png',
          originalName: 'one.png',
          size: first.size,
          mimeType: 'image/png',
        },
      ],
      errors: [{ filename: 'two.png', error: 'Invalid file format' }],
    })
  })

  it('returns 400 when every upload fails', async () => {
    const file = new File(['bad'], 'bad.png', { type: 'image/png' })
    uploadFile.mockRejectedValue(new Error('Invalid file format'))

    const response = await POST(createRequest([file]))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'All files failed to upload',
      errors: [{ filename: 'bad.png', error: 'Invalid file format' }],
    })
  })

  it('returns 500 when authorization fails', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    const file = new File(['one'], 'one.png', { type: 'image/png' })
    const response = await POST(createRequest([file]))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Forbidden',
    })
    expect(uploadFile).not.toHaveBeenCalled()
  })
})
