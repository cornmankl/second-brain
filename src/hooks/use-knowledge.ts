'use client'

import { useState, useEffect } from 'react'
import { KnowledgeItem } from '@prisma/client'

interface UseKnowledgeReturn {
  knowledgeItems: KnowledgeItem[]
  loading: boolean
  error: string | null
  fetchKnowledgeItems: (filters?: { status?: string; type?: string; quality?: string }) => Promise<void>
  createKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { 
    ideaIds?: string[]; 
    taskIds?: string[]; 
    areaIds?: string[] 
  }) => Promise<void>
  updateKnowledgeItem: (id: string, updates: Partial<KnowledgeItem> & { 
    ideaIds?: string[]; 
    taskIds?: string[]; 
    areaIds?: string[] 
  }) => Promise<void>
  deleteKnowledgeItem: (id: string) => Promise<void>
  processKnowledgeItem: (id: string) => Promise<void>
}

export function useKnowledge(): UseKnowledgeReturn {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchKnowledgeItems = async (filters?: { status?: string; type?: string; quality?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.quality) params.append('quality', filters.quality)
      
      const queryString = params.toString()
      const response = await fetch(`/api/knowledge${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge items')
      }
      
      const data = await response.json()
      setKnowledgeItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createKnowledgeItem = async (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { 
    ideaIds?: string[]; 
    taskIds?: string[]; 
    areaIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create knowledge item')
      }
      
      await fetchKnowledgeItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateKnowledgeItem = async (id: string, updates: Partial<KnowledgeItem> & { 
    ideaIds?: string[]; 
    taskIds?: string[]; 
    areaIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update knowledge item')
      }
      
      await fetchKnowledgeItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteKnowledgeItem = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete knowledge item')
      }
      
      await fetchKnowledgeItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const processKnowledgeItem = async (id: string) => {
    const item = knowledgeItems.find(i => i.id === id)
    if (!item) return

    const statusProgression = {
      'TO_PROCESS': 'PROCESSING',
      'PROCESSING': 'PROCESSED',
      'PROCESSED': 'REFERENCE',
      'REFERENCE': 'TO_PROCESS'
    }

    const newStatus = statusProgression[item.status as keyof typeof statusProgression]
    await updateKnowledgeItem(id, { status: newStatus as any })
  }

  useEffect(() => {
    fetchKnowledgeItems()
  }, [])

  return {
    knowledgeItems,
    loading,
    error,
    fetchKnowledgeItems,
    createKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    processKnowledgeItem
  }
}