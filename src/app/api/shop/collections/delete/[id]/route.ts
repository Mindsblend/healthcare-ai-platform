import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuthority({ requiredRole: 'ADMIN' })

    const { id: idParam } = await context.params
    const id = parseInt(idParam)

    console.log('DELETE collection ID:', id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid collection ID' },
        { status: 400 },
      )
    }

    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    })

    if (!existingCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 },
      )
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      collection,
    })
  } catch (error) {
    console.error('Error deleting collection:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete collection',
      },
      { status: 500 },
    )
  }
}
