'use client'

import { useState, useEffect } from 'react'
import { Idea } from '@prisma/client'

interface UseIdeasReturn {
  ideas: Idea[]
  loading: boolean
  error: string | null
  fetchIdeas: (filters?: { stage?: string; category?: string; impact?: string }) => Promise<void>
  createIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'lastReviewed' | 'reviewCount'> & { 
    relatedIdeaIds?: string[]; 
    resourceIds?: string[] 
  }) => Promise<void>
  updateIdea: (id: string, updates: Partial<Idea> & { 
    relatedIdeaIds?: string[]; 
    resourceIds?: string[] 
  }) => Promise<void>
  deleteIdea: (id: string) => Promise<void>
  advanceIdeaStage: (id: string) => Promise<void>
}

export function useIdeas(): UseIdeasReturn {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIdeas = async (filters?: { stage?: string; category?: string; impact?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.stage) params.append('stage', filters.stage)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.impact) params.append('impact', filters.impact)
      
      const queryString = params.toString()
      const response = await fetch(`/api/ideas${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch ideas')
      }
      
      const data = await response.json()
      setIdeas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createIdea = async (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'lastReviewed' | 'reviewCount'> & { 
    relatedIdeaIds?: string[]; 
    resourceIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idea)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create idea')
      }
      
      await fetchIdeas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateIdea = async (id: string, updates: Partial<Idea> & { 
    relatedIdeaIds?: string[]; 
    resourceIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update idea')
      }
      
      await fetchIdeas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteIdea = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete idea')
      }
      
      await fetchIdeas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const advanceIdeaStage = async (id: string) => {
    const idea = ideas.find(i => i.id === id)
    if (!idea) return

    const stageProgression = {
      'SEED': 'SPROUTING',
      'SPROUTING': 'GROWING',
      'GROWING': 'HARVEST',
      'HARVEST': 'DORMANT',
      'DORMANT': 'PRUNED',
      'PRUNED': 'SEED'
    }

    const newStage = stageProgression[idea.stage as keyof typeof stageProgression]
    await updateIdea(id, { stage: newStage as any })
  }

  useEffect(() => {
    fetchIdeas()
  }, [])

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    advanceIdeaStage
  }
}