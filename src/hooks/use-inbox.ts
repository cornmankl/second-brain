'use client'

import { useState, useEffect } from 'react'
import { InboxItem } from '@prisma/client'

interface UseInboxReturn {
  inboxItems: InboxItem[]
  loading: boolean
  error: string | null
  fetchInboxItems: (processed?: boolean) => Promise<void>
  createInboxItem: (item: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  updateInboxItem: (id: string, updates: Partial<InboxItem>) => Promise<void>
  deleteInboxItem: (id: string) => Promise<void>
}

export function useInbox(): UseInboxReturn {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInboxItems = async (processed?: boolean) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = processed !== undefined ? `?processed=${processed}` : ''
      const response = await fetch(`/api/inbox${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inbox items')
      }
      
      const data = await response.json()
      setInboxItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createInboxItem = async (item: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create inbox item')
      }
      
      await fetchInboxItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateInboxItem = async (id: string, updates: Partial<InboxItem>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/inbox/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update inbox item')
      }
      
      await fetchInboxItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteInboxItem = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/inbox/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete inbox item')
      }
      
      await fetchInboxItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInboxItems()
  }, [])

  return {
    inboxItems,
    loading,
    error,
    fetchInboxItems,
    createInboxItem,
    updateInboxItem,
    deleteInboxItem
  }
}