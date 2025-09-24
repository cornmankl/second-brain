import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update SRS card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      question, 
      answer, 
      type, 
      difficulty, 
      lastPerformance,
      understandingLevel,
      context,
      whyMatters,
      relatedCardIds
    } = body

    const updateData: any = {}
    if (question !== undefined) updateData.question = question
    if (answer !== undefined) updateData.answer = answer
    if (type !== undefined) updateData.type = type
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (context !== undefined) updateData.context = context
    if (whyMatters !== undefined) updateData.whyMatters = whyMatters

    // Handle performance-based scheduling
    if (lastPerformance !== undefined) {
      updateData.lastPerformance = lastPerformance
      updateData.repetitionCount = {
        increment: 1
      }

      // Calculate new interval based on performance
      const currentCard = await db.sRSCard.findUnique({
        where: { id: params.id }
      })

      if (currentCard) {
        const currentInterval = currentCard.interval || 1
        let newInterval = currentInterval

        switch (lastPerformance) {
          case 'PERFECT':
            newInterval = Math.round(currentInterval * 2.5)
            break
          case 'GOOD':
            newInterval = Math.round(currentInterval * 1.5)
            break
          case 'HARD':
            newInterval = currentInterval
            break
          case 'AGAIN':
            newInterval = Math.round(currentInterval * 0.5)
            break
        }

        updateData.interval = Math.max(1, newInterval)
        
        // Set next review date
        const nextReviewDate = new Date()
        nextReviewDate.setDate(nextReviewDate.getDate() + updateData.interval)
        updateData.nextReviewDate = nextReviewDate
      }
    }

    if (understandingLevel !== undefined) {
      updateData.understandingLevel = understandingLevel
    }

    const card = await db.sRSCard.update({
      where: { id: params.id },
      data: updateData,
      include: {
        relatedCards: true,
        connectedCards: true,
        source: true
      }
    })

    // Update relationships if provided
    if (relatedCardIds !== undefined) {
      await db.sRSCard.update({
        where: { id: params.id },
        data: {
          relatedCards: {
            set: relatedCardIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated card with relationships
    const updatedCard = await db.sRSCard.findUnique({
      where: { id: params.id },
      include: {
        relatedCards: true,
        connectedCards: true,
        source: true
      }
    })

    return NextResponse.json(updatedCard)
  } catch (error) {
    console.error('Error updating SRS card:', error)
    return NextResponse.json({ error: 'Failed to update SRS card' }, { status: 500 })
  }
}

// DELETE SRS card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.sRSCard.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting SRS card:', error)
    return NextResponse.json({ error: 'Failed to delete SRS card' }, { status: 500 })
  }
}