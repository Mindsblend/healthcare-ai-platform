import fs from 'fs/promises'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { LocalUploadService } from '@/features/dashboard/services/UploadService'

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn(),
    rm: vi.fn(),
  },
}))

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid'),
}))

const mockedFs = vi.mocked(fs)
const mockedUuid = vi.mocked(uuidv4)

function createFile(
  name = 'image.png',
  contents = 'test file contents',
  type = 'image/png',
): File {
  return new File([contents], name, { type })
}

describe('LocalUploadService.uploadFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedFs.mkdir.mockResolvedValue(undefined)
    mockedFs.writeFile.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('saves an allowed file and returns its metadata', async () => {
    const file = createFile()

    const result = await LocalUploadService.uploadFile(file)

    const expectedPath = path.join(
      process.cwd(),
      'public',
      'uploads',
      'general',
      'test-uuid.png',
    )

    expect(result).toEqual({
      url: '/uploads/general/test-uuid.png',
      filename: 'test-uuid.png',
      originalName: 'image.png',
      path: expectedPath,
      size: file.size,
      mimeType: 'image/png',
    })

    expect(mockedFs.mkdir).toHaveBeenCalledWith(
      path.join(process.cwd(), 'public', 'uploads', 'general'),
      { recursive: true },
    )

    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      expectedPath,
      Buffer.from('test file contents'),
    )

    expect(mockedUuid).toHaveBeenCalledOnce()
  })

  it('uses custom folder and allowed formats', async () => {
    const file = createFile('document.csv', 'a,b', 'text/csv')

    const result = await LocalUploadService.uploadFile(file, {
      folder: 'reports',
      allowedFormats: ['csv'],
    })

    expect(result.url).toBe('/uploads/reports/test-uuid.csv')
    expect(result.path).toBe(
      path.join(process.cwd(), 'public', 'uploads', 'reports', 'test-uuid.csv'),
    )
  })

  it('accepts uppercase extensions', async () => {
    const result = await LocalUploadService.uploadFile(createFile('IMAGE.PNG'))

    expect(result.filename).toBe('test-uuid.PNG')
    expect(result.url).toBe('/uploads/general/test-uuid.PNG')
  })

  it('rejects a disallowed extension before filesystem operations', async () => {
    await expect(
      LocalUploadService.uploadFile(createFile('script.exe')),
    ).rejects.toThrow(
      'Invalid file format. Allowed: jpg, jpeg, png, webp, gif, pdf',
    )

    expect(mockedFs.mkdir).not.toHaveBeenCalled()
    expect(mockedFs.writeFile).not.toHaveBeenCalled()
  })

  it('rejects files exceeding the default size limit', async () => {
    const file = createFile('large.png')
    Object.defineProperty(file, 'size', {
      configurable: true,
      value: 5 * 1024 * 1024 + 1,
    })

    await expect(LocalUploadService.uploadFile(file)).rejects.toThrow(
      'File size exceeds 5MB limit',
    )

    expect(mockedFs.mkdir).not.toHaveBeenCalled()
  })

  it('honors a custom maximum size', async () => {
    const file = createFile('large.png')
    Object.defineProperty(file, 'size', {
      configurable: true,
      value: 1025,
    })

    await expect(
      LocalUploadService.uploadFile(file, { maxSize: 1024 }),
    ).rejects.toThrow('File size exceeds 0.0009765625MB limit')

    expect(mockedFs.mkdir).not.toHaveBeenCalled()
  })

  it('propagates filesystem errors during upload', async () => {
    mockedFs.mkdir.mockRejectedValue(new Error('Permission denied'))

    await expect(LocalUploadService.uploadFile(createFile())).rejects.toThrow(
      'Permission denied',
    )

    expect(mockedFs.writeFile).not.toHaveBeenCalled()
  })
})

describe('LocalUploadService.uploadMultipleFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedFs.mkdir.mockResolvedValue(undefined)
    mockedFs.writeFile.mockResolvedValue(undefined)
  })

  it('uploads multiple files and returns results in input order', async () => {
    mockedUuid
      .mockReturnValueOnce('first-uuid')
      .mockReturnValueOnce('second-uuid')

    const files = [
      createFile('first.png', 'first contents'),
      createFile('second.pdf', 'second contents', 'application/pdf'),
    ]

    const results = await LocalUploadService.uploadMultipleFiles(files)

    expect(results).toHaveLength(2)
    expect(results[0].originalName).toBe('first.png')
    expect(results[0].filename).toBe('first-uuid.png')
    expect(results[1].originalName).toBe('second.pdf')
    expect(results[1].filename).toBe('second-uuid.pdf')
    expect(mockedFs.writeFile).toHaveBeenCalledTimes(2)
  })

  it('rejects when any file upload fails', async () => {
    const files = [createFile('valid.png'), createFile('invalid.exe')]

    await expect(LocalUploadService.uploadMultipleFiles(files)).rejects.toThrow(
      'Invalid file format',
    )

    expect(mockedFs.writeFile).toHaveBeenCalledTimes(1)
  })

  it('returns an empty array when given no files', async () => {
    await expect(LocalUploadService.uploadMultipleFiles([])).resolves.toEqual(
      [],
    )

    expect(mockedFs.mkdir).not.toHaveBeenCalled()
  })
})

describe('LocalUploadService.deleteFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true when the file is deleted', async () => {
    mockedFs.unlink.mockResolvedValue(undefined)

    const result = await LocalUploadService.deleteFile('reports', 'report.pdf')

    expect(result).toBe(true)
    expect(mockedFs.unlink).toHaveBeenCalledWith(
      path.join(process.cwd(), 'public', 'uploads', 'reports', 'report.pdf'),
    )
  })

  it('returns false when deletion fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedFs.unlink.mockRejectedValue(new Error('File not found'))

    const result = await LocalUploadService.deleteFile('reports', 'missing.pdf')

    expect(result).toBe(false)
    expect(errorSpy).toHaveBeenCalledWith('Delete failed:', expect.any(Error))
  })
})

describe('LocalUploadService.deleteFolder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true when the folder is deleted', async () => {
    mockedFs.rm.mockResolvedValue(undefined)

    const result = await LocalUploadService.deleteFolder('reports')

    expect(result).toBe(true)
    expect(mockedFs.rm).toHaveBeenCalledWith(
      path.join(process.cwd(), 'public', 'uploads', 'reports'),
      { recursive: true, force: true },
    )
  })

  it('returns false when folder deletion fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedFs.rm.mockRejectedValue(new Error('Permission denied'))

    const result = await LocalUploadService.deleteFolder('reports')

    expect(result).toBe(false)
    expect(errorSpy).toHaveBeenCalledWith(
      'Delete folder failed:',
      expect.any(Error),
    )
  })
})
