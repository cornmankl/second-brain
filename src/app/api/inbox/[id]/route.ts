import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update inbox item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const { title, type, priority, processed, quickNote, tags } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (type !== undefined) updateData.type = type
    if (priority !== undefined) updateData.priority = priority
    if (processed !== undefined) updateData.processed = processed
    if (quickNote !== undefined) updateData.quickNote = quickNote
    if (tags !== undefined) updateData.tags = tags ? JSON.stringify(tags) : null

    const inboxItem = await db.inboxItem.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(inboxItem)
  } catch (error) {
    console.error('Error updating inbox item:', error)
    return NextResponse.json({ error: 'Failed to update inbox item' }, { status: 500 })
  }
}

// DELETE inbox item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    await db.inboxItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inbox item:', error)
    return NextResponse.json({ error: 'Failed to delete inbox item' }, { status: 500 })
  }
}