import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (priority) where.priority = priority

    const tasks = await db.task.findMany({
      where,
      include: {
        subtasks: true,
        areas: true,
        relatedIdeas: true,
        knowledgeItems: true
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      type, 
      priority, 
      dueDate, 
      energyRequired, 
      context, 
      timeEstimate, 
      nextAction, 
      notes,
      projectId,
      areaIds,
      ideaIds,
      knowledgeIds
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Task name is required' }, { status: 400 })
    }

    const taskData: any = {
      name,
      type: type || 'TASK',
      priority: priority || 'P3_MEDIUM',
      energyRequired: energyRequired || 'MEDIUM',
      context: context ? JSON.stringify(context) : null,
      timeEstimate,
      nextAction,
      notes,
      userId: 'default-user' // TODO: Get from auth
    }

    if (dueDate) taskData.dueDate = new Date(dueDate)
    if (projectId) taskData.projectId = projectId

    const task = await db.task.create({
      data: taskData,
      include: {
        subtasks: true,
        areas: true,
        relatedIdeas: true,
        knowledgeItems: true
      }
    })

    // Connect relationships if provided
    if (areaIds && areaIds.length > 0) {
      await db.task.update({
        where: { id: task.id },
        data: {
          areas: {
            connect: areaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (ideaIds && ideaIds.length > 0) {
      await db.task.update({
        where: { id: task.id },
        data: {
          relatedIdeas: {
            connect: ideaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (knowledgeIds && knowledgeIds.length > 0) {
      await db.task.update({
        where: { id: task.id },
        data: {
          knowledgeItems: {
            connect: knowledgeIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated task with relationships
    const updatedTask = await db.task.findUnique({
      where: { id: task.id },
      include: {
        subtasks: true,
        areas: true,
        relatedIdeas: true,
        knowledgeItems: true
      }
    })

    return NextResponse.json(updatedTask, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}