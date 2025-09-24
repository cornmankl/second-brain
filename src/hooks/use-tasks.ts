'use client'

import { useState, useEffect } from 'react'
import { Task } from '@prisma/client'

interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: (filters?: { status?: string; type?: string; priority?: string }) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { 
    areaIds?: string[]; 
    ideaIds?: string[]; 
    knowledgeIds?: string[] 
  }) => Promise<void>
  updateTask: (id: string, updates: Partial<Task> & { 
    areaIds?: string[]; 
    ideaIds?: string[]; 
    knowledgeIds?: string[] 
  }) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (filters?: { status?: string; type?: string; priority?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.priority) params.append('priority', filters.priority)
      
      const queryString = params.toString()
      const response = await fetch(`/api/tasks${queryString ? `?${queryString}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { 
    areaIds?: string[]; 
    ideaIds?: string[]; 
    knowledgeIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create task')
      }
      
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task> & { 
    areaIds?: string[]; 
    ideaIds?: string[]; 
    knowledgeIds?: string[] 
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}