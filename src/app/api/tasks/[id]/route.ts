import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update task
export async function PUT(
  request: NextRequest,
  routeContext: { params: Promise<{ id: string }> }
) {
  try {
    const params = await routeContext.params
    const body = await request.json()
    const { 
      name, 
      status, 
      type, 
      priority, 
      dueDate, 
      energyRequired, 
      context, 
      timeEstimate, 
      actualTime,
      nextAction, 
      notes,
      projectId,
      areaIds,
      ideaIds,
      knowledgeIds
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (status !== undefined) updateData.status = status
    if (type !== undefined) updateData.type = type
    if (priority !== undefined) updateData.priority = priority
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (energyRequired !== undefined) updateData.energyRequired = energyRequired
    if (context !== undefined) updateData.context = context ? JSON.stringify(context) : null
    if (timeEstimate !== undefined) updateData.timeEstimate = timeEstimate
    if (actualTime !== undefined) updateData.actualTime = actualTime
    if (nextAction !== undefined) updateData.nextAction = nextAction
    if (notes !== undefined) updateData.notes = notes
    if (projectId !== undefined) updateData.projectId = projectId

    const task = await db.task.update({
      where: { id: params.id },
      data: updateData,
      include: {
        subtasks: true,
        areas: true,
        relatedIdeas: true,
        knowledgeItems: true
      }
    })

    // Update relationships if provided
    if (areaIds !== undefined) {
      await db.task.update({
        where: { id: params.id },
        data: {
          areas: {
            set: areaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (ideaIds !== undefined) {
      await db.task.update({
        where: { id: params.id },
        data: {
          relatedIdeas: {
            set: ideaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (knowledgeIds !== undefined) {
      await db.task.update({
        where: { id: params.id },
        data: {
          knowledgeItems: {
            set: knowledgeIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated task with relationships
    const updatedTask = await db.task.findUnique({
      where: { id: params.id },
      include: {
        subtasks: true,
        areas: true,
        relatedIdeas: true,
        knowledgeItems: true
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  routeContext: { params: Promise<{ id: string }> }
) {
  try {
    const params = await routeContext.params
    await db.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}