import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update area
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const { 
      areaName, 
      type, 
      visionStatement, 
      currentFocus, 
      quarterlyGoals, 
      keyMetrics
    } = body

    const updateData: any = {}
    if (areaName !== undefined) updateData.areaName = areaName
    if (type !== undefined) updateData.type = type
    if (visionStatement !== undefined) updateData.visionStatement = visionStatement
    if (currentFocus !== undefined) updateData.currentFocus = currentFocus
    if (quarterlyGoals !== undefined) updateData.quarterlyGoals = quarterlyGoals
    if (keyMetrics !== undefined) updateData.keyMetrics = keyMetrics

    const area = await db.area.update({
      where: { id: params.id },
      data: updateData,
      include: {
        tasks: true,
        resources: true
      }
    })

    return NextResponse.json(area)
  } catch (error) {
    console.error('Error updating area:', error)
    return NextResponse.json({ error: 'Failed to update area' }, { status: 500 })
  }
}

// DELETE area
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    await db.area.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting area:', error)
    return NextResponse.json({ error: 'Failed to delete area' }, { status: 500 })
  }
}