import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all knowledge items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const quality = searchParams.get('quality')
    
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (quality) where.quality = quality

    const knowledgeItems = await db.knowledgeItem.findMany({
      where,
      include: {
        ideas: true,
        tasks: true,
        srsCards: true,
        areas: true
      },
      orderBy: [
        { quality: 'desc' },
        { dateConsumed: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(knowledgeItems)
  } catch (error) {
    console.error('Error fetching knowledge items:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge items' }, { status: 500 })
  }
}

// POST create new knowledge item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      type, 
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

    if (!title) {
      return NextResponse.json({ error: 'Knowledge item title is required' }, { status: 400 })
    }

    const knowledgeData = {
      title,
      type: type || 'ARTICLE',
      sourceUrl,
      author,
      dateConsumed: dateConsumed ? new Date(dateConsumed) : null,
      keyConcepts: keyConcepts ? JSON.stringify(keyConcepts) : null,
      permanentNotes,
      originalNotes,
      quality: quality || 'GOOD',
      tags: tags ? JSON.stringify(tags) : null,
      userId: 'default-user' // TODO: Get from auth
    }

    const knowledgeItem = await db.knowledgeItem.create({
      data: knowledgeData,
      include: {
        ideas: true,
        tasks: true,
        srsCards: true,
        areas: true
      }
    })

    // Connect relationships if provided
    if (ideaIds && ideaIds.length > 0) {
      await db.knowledgeItem.update({
        where: { id: knowledgeItem.id },
        data: {
          ideas: {
            connect: ideaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (taskIds && taskIds.length > 0) {
      await db.knowledgeItem.update({
        where: { id: knowledgeItem.id },
        data: {
          tasks: {
            connect: taskIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (areaIds && areaIds.length > 0) {
      await db.knowledgeItem.update({
        where: { id: knowledgeItem.id },
        data: {
          areas: {
            connect: areaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated knowledge item with relationships
    const updatedKnowledgeItem = await db.knowledgeItem.findUnique({
      where: { id: knowledgeItem.id },
      include: {
        ideas: true,
        tasks: true,
        srsCards: true,
        areas: true
      }
    })

    return NextResponse.json(updatedKnowledgeItem, { status: 201 })
  } catch (error) {
    console.error('Error creating knowledge item:', error)
    return NextResponse.json({ error: 'Failed to create knowledge item' }, { status: 500 })
  }
}