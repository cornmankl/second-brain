import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all SRS cards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')
    const dueToday = searchParams.get('dueToday')
    
    const where: any = {}
    if (type) where.type = type
    if (difficulty) where.difficulty = difficulty
    if (dueToday === 'true') {
      where.nextReviewDate = {
        lte: new Date()
      }
    }

    const srsCards = await db.sRSCard.findMany({
      where,
      include: {
        relatedCards: true,
        connectedCards: true,
        source: true
      },
      orderBy: [
        { nextReviewDate: 'asc' },
        { difficulty: 'asc' },
        { createdAt: 'desc' }
      ],
      take: dueToday === 'true' ? 20 : undefined // Limit to 20 cards for daily review
    })

    return NextResponse.json(srsCards)
  } catch (error) {
    console.error('Error fetching SRS cards:', error)
    return NextResponse.json({ error: 'Failed to fetch SRS cards' }, { status: 500 })
  }
}

// POST create new SRS card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      question, 
      answer, 
      type, 
      difficulty, 
      sourceId,
      context,
      whyMatters,
      relatedCardIds
    } = body

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 })
    }

    const cardData = {
      question,
      answer,
      type: type || 'FACT',
      difficulty: difficulty || 'MEDIUM',
      nextReviewDate: new Date(),
      interval: 1,
      repetitionCount: 0,
      lastPerformance: 'GOOD',
      understandingLevel: 'WORKING',
      sourceId,
      context,
      whyMatters,
      userId: 'default-user' // TODO: Get from auth
    }

    const card = await db.sRSCard.create({
      data: cardData,
      include: {
        relatedCards: true,
        connectedCards: true,
        source: true
      }
    })

    // Connect relationships if provided
    if (relatedCardIds && relatedCardIds.length > 0) {
      await db.sRSCard.update({
        where: { id: card.id },
        data: {
          relatedCards: {
            connect: relatedCardIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated card with relationships
    const updatedCard = await db.sRSCard.findUnique({
      where: { id: card.id },
      include: {
        relatedCards: true,
        connectedCards: true,
        source: true
      }
    })

    return NextResponse.json(updatedCard, { status: 201 })
  } catch (error) {
    console.error('Error creating SRS card:', error)
    return NextResponse.json({ error: 'Failed to create SRS card' }, { status: 500 })
  }
}