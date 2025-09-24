'use client'

import { useState, useEffect } from 'react'
import { SRSCard } from '@prisma/client'

interface UseSRSReturn {
  srsCards: SRSCard[]
  loading: boolean
  error: string | null
  fetchSRSCards: (filters?: { type?: string; difficulty?: string; dueToday?: boolean }) => Promise<void>
  createSRSCard: (card: Omit<SRSCard, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'nextReviewDate' | 'interval' | 'repetitionCount' | 'lastPerformance' | 'understandingLevel'> & { 
    relatedCardIds?: string[] 
  }) => Promise<void>
  updateSRSCard: (id: string, updates: Partial<SRSCard> & { 
    relatedCardIds?: string[] 
  }) => Promise<void>
  deleteSRSCard: (id: string) => Promise<void>
  reviewCard: (id: string, performance: 'PERFECT' | 'GOOD' | 'HARD' | 'AGAIN') => Promise<void>
  getDueCards: () => Promise<SRSCard[]>
}

export function useSRS(): UseSRSReturn {
  const [srsCards, setSrsCards] = useState<SRSCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSRSCards = async (filters?: { type?: string; difficulty?: string; dueToday?: boolean }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.type) params.append('type', filters.type)
      if (filters?.difficulty) params.append('difficulty', filters.difficulty)
      if (filters?.dueToday !== undefined) params.append('dueToday', filters.dueToday.toString())
      
      const queryString = params.toString()
      const response = await fetch(`/api/srs${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch SRS cards')
      }
      
      const data = await response.json()
      setSrsCards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createSRSCard = async (card: Omit<SRSCard, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'nextReviewDate' | 'interval' | 'repetitionCount' | 'lastPerformance' | 'understandingLevel'> & { 
    relatedCardIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create SRS card')
      }
      
      await fetchSRSCards()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateSRSCard = async (id: string, updates: Partial<SRSCard> & { 
    relatedCardIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/srs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update SRS card')
      }
      
      await fetchSRSCards()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteSRSCard = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/srs/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete SRS card')
      }
      
      await fetchSRSCards()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const reviewCard = async (id: string, performance: 'PERFECT' | 'GOOD' | 'HARD' | 'AGAIN') => {
    await updateSRSCard(id, { lastPerformance: performance })
  }

  const getDueCards = async () => {
    try {
      const response = await fetch('/api/srs?dueToday=true')
      if (!response.ok) {
        throw new Error('Failed to fetch due cards')
      }
      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return []
    }
  }

  useEffect(() => {
    fetchSRSCards()
  }, [])

  return {
    srsCards,
    loading,
    error,
    fetchSRSCards,
    createSRSCard,
    updateSRSCard,
    deleteSRSCard,
    reviewCard,
    getDueCards
  }
}