import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
    address: {
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

import { prisma } from '@/lib/prisma'
import { UserService } from '@/features/shop/services/UserService'

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    prismaMock.$transaction.mockImplementation(
      async (callback: (tx: typeof prismaMock) => Promise<unknown>) =>
        callback(prismaMock),
    )
  })

  describe('fetchCurrentUser', () => {
    it('fetches a user by ID and selects only profile fields', async () => {
      const user = {
        id: 'user-1',
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@example.com',
        phone: '123456789',
      }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never)

      await expect(UserService.fetchCurrentUser('user-1')).resolves.toEqual(
        user,
      )
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      })
    })

    it('returns null when the user is not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      await expect(UserService.fetchCurrentUser('missing')).resolves.toBeNull()
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.user.findUnique).mockRejectedValue(error)
      await expect(UserService.fetchCurrentUser('user-1')).rejects.toBe(error)
    })
  })

  describe('fetchAllUsers', () => {
    it('fetches user summaries without unrelated fields', async () => {
      const users = [
        { id: 'user-1', email: 'alex@example.com', phone: '123456789' },
      ]
      vi.mocked(prisma.user.findMany).mockResolvedValue(users as never)

      await expect(UserService.fetchAllUsers()).resolves.toEqual(users)
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true, email: true, phone: true },
      })
    })

    it('returns an empty array when there are no users', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([])
      await expect(UserService.fetchAllUsers()).resolves.toEqual([])
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.user.findMany).mockRejectedValue(error)
      await expect(UserService.fetchAllUsers()).rejects.toBe(error)
    })
  })

  describe('createUser', () => {
    it('looks up phone identifiers by phone', async () => {
      const user = { id: 'user-1', phone: '123456789' }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never)

      await expect(
        UserService.createUser('123456789', 'phone'),
      ).resolves.toEqual(user)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { phone: '123456789' },
      })
      expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('looks up non-phone identifiers by email', async () => {
      const user = { id: 'user-1', email: 'alex@example.com' }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never)

      await expect(
        UserService.createUser('alex@example.com', 'email'),
      ).resolves.toEqual(user)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'alex@example.com' },
      })
      expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('creates a user with a phone when no matching user exists', async () => {
      const user = { id: 'user-2', phone: '987654321' }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.user.create).mockResolvedValue(user as never)

      await expect(
        UserService.createUser('987654321', 'phone'),
      ).resolves.toEqual(user)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { phone: '987654321' },
      })
    })

    it('creates a user with an email when no matching user exists', async () => {
      const user = { id: 'user-3', email: 'new@example.com' }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.user.create).mockResolvedValue(user as never)

      await expect(
        UserService.createUser('new@example.com', 'email'),
      ).resolves.toEqual(user)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'new@example.com' },
      })
    })

    it('propagates lookup errors without creating a user', async () => {
      const error = new Error('Lookup failed')
      vi.mocked(prisma.user.findUnique).mockRejectedValue(error)

      await expect(
        UserService.createUser('alex@example.com', 'email'),
      ).rejects.toBe(error)
      expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('propagates creation errors', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      const error = new Error('Creation failed')
      vi.mocked(prisma.user.create).mockRejectedValue(error)

      await expect(
        UserService.createUser('new@example.com', 'email'),
      ).rejects.toBe(error)
    })
  })

  describe('fetchUserWithAddresses', () => {
    it('fetches a user with addresses ordered with defaults first', async () => {
      const user = {
        id: 'user-1',
        addresses: [{ id: 'address-1', isDefault: true }],
      }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never)

      await expect(
        UserService.fetchUserWithAddresses('user-1'),
      ).resolves.toEqual(user)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        include: { addresses: { orderBy: { isDefault: 'desc' } } },
      })
    })

    it('returns null when the user is not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      await expect(
        UserService.fetchUserWithAddresses('missing'),
      ).resolves.toBeNull()
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.user.findUnique).mockRejectedValue(error)
      await expect(UserService.fetchUserWithAddresses('user-1')).rejects.toBe(
        error,
      )
    })
  })

  describe('fetchUserWithOrders', () => {
    it('fetches orders newest first with selected product fields', async () => {
      const user = { id: 'user-1', orders: [{ id: 'order-1', items: [] }] }
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never)

      await expect(UserService.fetchUserWithOrders('user-1')).resolves.toEqual(
        user,
      )
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      price: true,
                      image: true,
                      slug: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    })

    it('returns null when the user is not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      await expect(
        UserService.fetchUserWithOrders('missing'),
      ).resolves.toBeNull()
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.user.findUnique).mockRejectedValue(error)
      await expect(UserService.fetchUserWithOrders('user-1')).rejects.toBe(
        error,
      )
    })
  })

  describe('createAddress', () => {
    const addressData = {
      street: 'Main Street 1',
      city: 'Madrid',
      isDefault: false,
    }

    it('automatically makes the first address the default', async () => {
      vi.mocked(prisma.address.count).mockResolvedValue(0)
      const created = {
        id: 'address-1',
        ...addressData,
        userId: 'user-1',
        isDefault: true,
      }
      vi.mocked(prisma.address.create).mockResolvedValue(created as never)

      await expect(
        UserService.createAddress('user-1', addressData),
      ).resolves.toEqual(created)

      expect(prisma.address.count).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      })
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: {
          ...addressData,
          userId: 'user-1',
          isDefault: true,
        },
      })
    })

    it('does not make a later address default unless requested', async () => {
      vi.mocked(prisma.address.count).mockResolvedValue(1)
      vi.mocked(prisma.address.create).mockResolvedValue({
        id: 'address-2',
      } as never)

      await UserService.createAddress('user-1', addressData)

      expect(prisma.address.create).toHaveBeenCalledWith({
        data: { ...addressData, userId: 'user-1', isDefault: false },
      })
    })

    it('respects an explicit default request for a later address', async () => {
      vi.mocked(prisma.address.count).mockResolvedValue(1)
      vi.mocked(prisma.address.create).mockResolvedValue({
        id: 'address-2',
      } as never)

      await UserService.createAddress('user-1', {
        ...addressData,
        isDefault: true,
      })

      expect(prisma.address.create).toHaveBeenCalledWith({
        data: { ...addressData, userId: 'user-1', isDefault: true },
      })
    })

    it('propagates count errors without creating an address', async () => {
      const error = new Error('Count failed')
      vi.mocked(prisma.address.count).mockRejectedValue(error)

      await expect(
        UserService.createAddress('user-1', addressData),
      ).rejects.toBe(error)
      expect(prisma.address.create).not.toHaveBeenCalled()
    })

    it('propagates address creation errors', async () => {
      vi.mocked(prisma.address.count).mockResolvedValue(0)
      const error = new Error('Creation failed')
      vi.mocked(prisma.address.create).mockRejectedValue(error)

      await expect(
        UserService.createAddress('user-1', addressData),
      ).rejects.toBe(error)
    })
  })

  describe('updateAddress', () => {
    it('updates an address scoped to its owner', async () => {
      const updated = { id: 'address-1', city: 'Barcelona' }
      vi.mocked(prisma.address.update).mockResolvedValue(updated as never)

      await expect(
        UserService.updateAddress('address-1', 'user-1', { city: 'Barcelona' }),
      ).resolves.toEqual(updated)

      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: 'address-1', userId: 'user-1' },
        data: { city: 'Barcelona' },
      })
    })

    it('propagates database errors', async () => {
      const error = new Error('Update failed')
      vi.mocked(prisma.address.update).mockRejectedValue(error)

      await expect(
        UserService.updateAddress('address-1', 'user-1', { city: 'Barcelona' }),
      ).rejects.toBe(error)
    })
  })

  describe('deleteAddress', () => {
    it('deletes an address scoped to its owner', async () => {
      const deleted = { id: 'address-1' }
      vi.mocked(prisma.address.delete).mockResolvedValue(deleted as never)

      await expect(
        UserService.deleteAddress('address-1', 'user-1'),
      ).resolves.toEqual(deleted)

      expect(prisma.address.delete).toHaveBeenCalledWith({
        where: { id: 'address-1', userId: 'user-1' },
      })
    })

    it('propagates database errors', async () => {
      const error = new Error('Delete failed')
      vi.mocked(prisma.address.delete).mockRejectedValue(error)

      await expect(
        UserService.deleteAddress('address-1', 'user-1'),
      ).rejects.toBe(error)
    })
  })

  describe('setDefaultAddress', () => {
    it('sets the selected address as default and clears other defaults in a transaction', async () => {
      const updated = { id: 'address-2', userId: 'user-1', isDefault: true }
      vi.mocked(prisma.address.update).mockResolvedValue(updated as never)
      vi.mocked(prisma.address.updateMany).mockResolvedValue({
        count: 2,
      } as never)

      await expect(
        UserService.setDefaultAddress('address-2', 'user-1'),
      ).resolves.toEqual(updated)

      expect(prisma.$transaction).toHaveBeenCalledOnce()
      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: 'address-2', userId: 'user-1' },
        data: { isDefault: true },
      })
      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          id: { not: 'address-2' },
        },
        data: { isDefault: false },
      })
    })

    it('does not clear other defaults if setting the selected address fails', async () => {
      const error = new Error('Could not set default')
      vi.mocked(prisma.address.update).mockRejectedValue(error)

      await expect(
        UserService.setDefaultAddress('address-2', 'user-1'),
      ).rejects.toBe(error)

      expect(prisma.address.updateMany).not.toHaveBeenCalled()
    })

    it('propagates errors when clearing other defaults fails', async () => {
      const error = new Error('Could not clear defaults')
      vi.mocked(prisma.address.update).mockResolvedValue({
        id: 'address-2',
        userId: 'user-1',
        isDefault: true,
      } as never)
      vi.mocked(prisma.address.updateMany).mockRejectedValue(error)

      await expect(
        UserService.setDefaultAddress('address-2', 'user-1'),
      ).rejects.toBe(error)
    })
  })

  describe('updateUserProfile', () => {
    it('updates the specified profile fields for the selected user', async () => {
      const updated = { id: 'user-1', firstName: 'Alex', lastName: 'Smith' }
      vi.mocked(prisma.user.update).mockResolvedValue(updated as never)

      await expect(
        UserService.updateUserProfile('user-1', {
          firstName: 'Alex',
          lastName: 'Smith',
        }),
      ).resolves.toEqual(updated)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { firstName: 'Alex', lastName: 'Smith' },
      })
    })

    it('supports partial profile updates', async () => {
      vi.mocked(prisma.user.update).mockResolvedValue({ id: 'user-1' } as never)

      await UserService.updateUserProfile('user-1', { firstName: 'Alex' })

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { firstName: 'Alex' },
      })
    })

    it('propagates database errors', async () => {
      const error = new Error('Profile update failed')
      vi.mocked(prisma.user.update).mockRejectedValue(error)

      await expect(
        UserService.updateUserProfile('user-1', { firstName: 'Alex' }),
      ).rejects.toBe(error)
    })
  })
})
