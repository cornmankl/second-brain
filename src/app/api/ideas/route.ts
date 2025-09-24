import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all ideas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const category = searchParams.get('category')
    const impact = searchParams.get('impact')
    
    const where: any = {}
    if (stage) where.stage = stage
    if (category) where.category = category
    if (impact) where.potentialImpact = impact

    const ideas = await db.idea.findMany({
      where,
      include: {
        relatedIdeas: true,
        connectedIdeas: true,
        resources: true,
        tasks: true
      },
      orderBy: [
        { potentialImpact: 'desc' },
        { lastReviewed: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
  }
}

// POST create new idea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      category, 
      potentialImpact, 
      effortRequired, 
      nextExperiment, 
      successMetrics, 
      notes,
      relatedIdeaIds,
      resourceIds
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Idea title is required' }, { status: 400 })
    }

    const ideaData = {
      title,
      category: category || 'PERSONAL',
      potentialImpact: potentialImpact || 'MEDIUM',
      effortRequired: effortRequired || 'MEDIUM',
      nextExperiment,
      successMetrics,
      notes,
      userId: 'default-user' // TODO: Get from auth
    }

    const idea = await db.idea.create({
      data: ideaData,
      include: {
        relatedIdeas: true,
        connectedIdeas: true,
        resources: true,
        tasks: true
      }
    })

    // Connect relationships if provided
    if (relatedIdeaIds && relatedIdeaIds.length > 0) {
      await db.idea.update({
        where: { id: idea.id },
        data: {
          relatedIdeas: {
            connect: relatedIdeaIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    if (resourceIds && resourceIds.length > 0) {
      await db.idea.update({
        where: { id: idea.id },
        data: {
          resources: {
            connect: resourceIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch the updated idea with relationships
    const updatedIdea = await db.idea.findUnique({
      where: { id: idea.id },
      include: {
        relatedIdeas: true,
        connectedIdeas: true,
        resources: true,
        tasks: true
      }
    })

    return NextResponse.json(updatedIdea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 })
  }
}