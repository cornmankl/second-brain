import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// GET all inbox items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const processed = searchParams.get('processed')
    
    const where = processed === 'true' 
      ? { processed: true }
      : processed === 'false'
      ? { processed: false }
      : {}

    const inboxItems = await db.inboxItem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(inboxItems)
  } catch (error) {
    console.error('Error fetching inbox items:', error)
    return NextResponse.json({ error: 'Failed to fetch inbox items' }, { status: 500 })
  }
}

// POST create new inbox item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, priority, quickNote, tags } = body

    if (!title || !type || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const inboxItem = await db.inboxItem.create({
      data: {
        title,
        type,
        priority,
        quickNote,
        tags: tags ? JSON.stringify(tags) : null,
        userId: 'default-user' // TODO: Get from auth
      }
    })

    return NextResponse.json(inboxItem, { status: 201 })
  } catch (error) {
    console.error('Error creating inbox item:', error)
    return NextResponse.json({ error: 'Failed to create inbox item' }, { status: 500 })
  }
}