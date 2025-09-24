'use client'

import { useState, useEffect } from 'react'
import { Area } from '@prisma/client'

interface UseAreasReturn {
  areas: Area[]
  loading: boolean
  error: string | null
  fetchAreas: (filters?: { type?: string }) => Promise<void>
  createArea: (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'lastReview'>) => Promise<void>
  updateArea: (id: string, updates: Partial<Area>) => Promise<void>
  deleteArea: (id: string) => Promise<void>
}

export function useAreas(): UseAreasReturn {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAreas = async (filters?: { type?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.type) params.append('type', filters.type)
      
      const queryString = params.toString()
      const response = await fetch(`/api/areas${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch areas')
      }
      
      const data = await response.json()
      setAreas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createArea = async (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'lastReview'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(area)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create area')
      }
      
      await fetchAreas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateArea = async (id: string, updates: Partial<Area>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update area')
      }
      
      await fetchAreas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteArea = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete area')
      }
      
      await fetchAreas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  return {
    areas,
    loading,
    error,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea
  }
}