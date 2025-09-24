import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update knowledge item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      title, 
      type, 
      status, 
      sourceUrl, 
      author, 
      dateConsumed, 
      keyConcepts, 
      permanentNotes, 
      originalNotes,
      quality,
      tags,
      ideaIds,
      taskIds,
      areaIds
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (type !== undefined) updateData.type = type
    if (status !== undefined) updateData.status = status
    if (sourceUrl !== undefined) updateData.sourceUrl = sourceUrl
    if (author !== undefined) updateData.author = author
    if (dateConsumed !== undefined) updateData.dateConsumed = dateConsumed ? new Date(dateConsumed) : null
    if (keyConcepts !== undefined) updateData.keyConcepts = keyConcepts ? JSON.stringify(keyConcepts) : null
    if (permanentNotes !== undefined) updateData.permanentNotes = permanentNotes
    if (originalNotes !== undefined) updateData.originalNotes = originalNotes
    if (quality !== undefined) updateData.quality = quality
    if (tags !== undefined) updateData.tags = tags ? JSON.stringify(tags) : null

    const knowledgeItem = await db.knowledgeItem.update({
      where: { id: params.id },
      data: updateData,
      include: {
        ideas: true,
        tasks: true,
        srsCards: true,
        areas: true
      }
    })

    // Update relationships if provided
    if (ideaIds !== undefined) {
      await db.knowledgeItem.update({
        where: { id: params.id },
        data: {
          ideas: {
            set: ideaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (taskIds !== undefined) {
      await db.knowledgeItem.update({
        where: { id: params.id },
        data: {
          tasks: {
            set: taskIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (areaIds !== undefined) {
      await db.knowledgeItem.update({
        where: { id: params.id },
        data: {
          areas: {
            set: areaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated knowledge item with relationships
    const updatedKnowledgeItem = await db.knowledgeItem.findUnique({
      where: { id: params.id },
      include: {
        ideas: true,
        tasks: true,
        srsCards: true,
        areas: true
      }
    })

    return NextResponse.json(updatedKnowledgeItem)
  } catch (error) {
    console.error('Error updating knowledge item:', error)
    return NextResponse.json({ error: 'Failed to update knowledge item' }, { status: 500 })
  }
}

// DELETE knowledge item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.knowledgeItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting knowledge item:', error)
    return NextResponse.json({ error: 'Failed to delete knowledge item' }, { status: 500 })
  }
}