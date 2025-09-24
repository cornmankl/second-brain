import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all areas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    const where: any = {}
    if (type) where.type = type

    const areas = await db.area.findMany({
      where,
      include: {
        tasks: true,
        resources: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(areas)
  } catch (error) {
    console.error('Error fetching areas:', error)
    return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 })
  }
}

// POST create new area
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      areaName, 
      type, 
      visionStatement, 
      currentFocus, 
      quarterlyGoals, 
      keyMetrics
    } = body

    if (!areaName) {
      return NextResponse.json({ error: 'Area name is required' }, { status: 400 })
    }

    const area = await db.area.create({
      data: {
        areaName,
        type: type || 'PERSONAL',
        visionStatement,
        currentFocus,
        quarterlyGoals,
        keyMetrics,
        userId: 'default-user' // TODO: Get from auth
      },
      include: {
        tasks: true,
        resources: true
      }
    })

    return NextResponse.json(area, { status: 201 })
  } catch (error) {
    console.error('Error creating area:', error)
    return NextResponse.json({ error: 'Failed to create area' }, { status: 500 })
  }
}