import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update idea
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      title, 
      stage, 
      category, 
      potentialImpact, 
      effortRequired, 
      nextExperiment, 
      successMetrics, 
      notes,
      relatedIdeaIds,
      resourceIds
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (stage !== undefined) updateData.stage = stage
    if (category !== undefined) updateData.category = category
    if (potentialImpact !== undefined) updateData.potentialImpact = potentialImpact
    if (effortRequired !== undefined) updateData.effortRequired = effortRequired
    if (nextExperiment !== undefined) updateData.nextExperiment = nextExperiment
    if (successMetrics !== undefined) updateData.successMetrics = successMetrics
    if (notes !== undefined) updateData.notes = notes
    
    // Update last reviewed and review count when stage changes
    if (stage !== undefined) {
      updateData.lastReviewed = new Date()
      updateData.reviewCount = {
        increment: 1
      }
    }

    const idea = await db.idea.update({
      where: { id: params.id },
      data: updateData,
      include: {
        relatedIdeas: true,
        connectedIdeas: true,
        resources: true,
        tasks: true
      }
    })

    // Update relationships if provided
    if (relatedIdeaIds !== undefined) {
      await db.idea.update({
        where: { id: params.id },
        data: {
          relatedIdeas: {
            set: relatedIdeaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (resourceIds !== undefined) {
      await db.idea.update({
        where: { id: params.id },
        data: {
          resources: {
            set: resourceIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated idea with relationships
    const updatedIdea = await db.idea.findUnique({
      where: { id: params.id },
      include: {
        relatedIdeas: true,
        connectedIdeas: true,
        resources: true,
        tasks: true
      }
    })

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 })
  }
}

// DELETE idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.idea.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 })
  }
}