'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInbox } from '@/hooks/use-inbox'
import { useTasks } from '@/hooks/use-tasks'
import { useIdeas } from '@/hooks/use-ideas'
import { useKnowledge } from '@/hooks/use-knowledge'
import { useSRS } from '@/hooks/use-srs'
import { InboxItem, Task, Idea, KnowledgeItem, SRSCard } from '@prisma/client'
import { 
  Brain, 
  Inbox, 
  CheckSquare, 
  Lightbulb, 
  BookOpen, 
  RotateCcw, 
  Target, 
  Calendar,
  Plus,
  Search,
  Filter,
  Menu,
  Trash2,
  Check
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemType, setNewItemType] = useState('TASK')
  const [newItemPriority, setNewItemPriority] = useState('NORMAL')
  const [newItemNote, setNewItemNote] = useState('')

  const { 
    inboxItems, 
    loading: inboxLoading, 
    error: inboxError, 
    createInboxItem, 
    updateInboxItem, 
    deleteInboxItem,
    fetchInboxItems 
  } = useInbox()

  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask, 
    deleteTask,
    fetchTasks 
  } = useTasks()

  const { 
    ideas, 
    loading: ideasLoading, 
    error: ideasError, 
    createIdea, 
    updateIdea, 
    deleteIdea,
    advanceIdeaStage,
    fetchIdeas 
  } = useIdeas()

  const { 
    knowledgeItems, 
    loading: knowledgeLoading, 
    error: knowledgeError, 
    createKnowledgeItem, 
    updateKnowledgeItem, 
    deleteKnowledgeItem,
    processKnowledgeItem,
    fetchKnowledgeItems 
  } = useKnowledge()

  const { 
    srsCards, 
    loading: srsLoading, 
    error: srsError, 
    createSRSCard, 
    updateSRSCard, 
    deleteSRSCard,
    reviewCard,
    fetchSRSCards,
    getDueCards
  } = useSRS()

  const handleCreateItem = async () => {
    if (!newItemTitle.trim()) return

    await createInboxItem({
      title: newItemTitle,
      type: newItemType as any,
      priority: newItemPriority as any,
      quickNote: newItemNote || null,
      processed: false,
      tags: null
    })

    // Reset form
    setNewItemTitle('')
    setNewItemNote('')
  }

  const handleProcessItem = async (id: string) => {
    await updateInboxItem(id, { processed: true })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500'
      case 'HIGH':
        return 'bg-orange-500'
      case 'NORMAL':
        return 'bg-yellow-500'
      case 'LOW':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '🔥'
      case 'HIGH':
        return '⚡'
      case 'NORMAL':
        return '🔵'
      case 'LOW':
        return '🟢'
      default:
        return '⚪'
    }
  }

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1_CRITICAL':
        return 'bg-red-500'
      case 'P2_HIGH':
        return 'bg-orange-500'
      case 'P3_MEDIUM':
        return 'bg-yellow-500'
      case 'P4_LOW':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-500'
      case 'IN_PROGRESS':
        return 'bg-blue-500'
      case 'NOT_STARTED':
        return 'bg-gray-500'
      case 'BLOCKED':
        return 'bg-red-500'
      case 'CANCELLED':
        return 'bg-gray-400'
      default:
        return 'bg-gray-500'
    }
  }

  const getIdeaStageColor = (stage: string) => {
    switch (stage) {
      case 'SEED':
        return 'bg-gray-500'
      case 'SPROUTING':
        return 'bg-green-500'
      case 'GROWING':
        return 'bg-blue-500'
      case 'HARVEST':
        return 'bg-orange-500'
      case 'DORMANT':
        return 'bg-yellow-500'
      case 'PRUNED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getIdeaStageIcon = (stage: string) => {
    switch (stage) {
      case 'SEED':
        return '🌱'
      case 'SPROUTING':
        return '🌿'
      case 'GROWING':
        return '🌳'
      case 'HARVEST':
        return '🍎'
      case 'DORMANT':
        return '❄️'
      case 'PRUNED':
        return '❌'
      default:
        return '⚪'
    }
  }

  const getKnowledgeStatusColor = (status: string) => {
    switch (status) {
      case 'TO_PROCESS':
        return 'bg-gray-500'
      case 'PROCESSING':
        return 'bg-blue-500'
      case 'PROCESSED':
        return 'bg-green-500'
      case 'REFERENCE':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getKnowledgeQualityColor = (quality: string) => {
    switch (quality) {
      case 'EVERGREEN':
        return 'bg-green-600'
      case 'GOOD':
        return 'bg-blue-500'
      case 'OKAY':
        return 'bg-yellow-500'
      case 'POOR':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getSRSDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-500'
      case 'MEDIUM':
        return 'bg-yellow-500'
      case 'HARD':
        return 'bg-orange-500'
      case 'EXPERT':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getUnderstandingLevelColor = (level: string) => {
    switch (level) {
      case 'SURFACE':
        return 'bg-gray-500'
      case 'WORKING':
        return 'bg-blue-500'
      case 'DEEP':
        return 'bg-purple-500'
      case 'TEACHING':
        return 'bg-green-600'
      default:
        return 'bg-gray-500'
    }
  }

  const filteredInboxItems = inboxItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.quickNote && item.quickNote.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const unprocessedItems = filteredInboxItems.filter(item => !item.processed)
  const processedItems = filteredInboxItems.filter(item => item.processed)

  // Mock data for other tabs (will be implemented later)
  const mockIdeas = []
  const mockKnowledgeItems = []
  const mockSrsCards = []
  const mockAreas = []
  const mockReviews = []

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Second Brain</h1>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 pb-20">
        {/* Quick Capture */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Capture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input 
                placeholder="Capture anything..."
                className="w-full"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
              />
              <Textarea 
                placeholder="Quick note (optional)..."
                className="w-full"
                value={newItemNote}
                onChange={(e) => setNewItemNote(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Select value={newItemType} onValueChange={setNewItemType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TASK">Task</SelectItem>
                    <SelectItem value="IDEA">Idea</SelectItem>
                    <SelectItem value="NOTE">Note</SelectItem>
                    <SelectItem value="QUESTION">Question</SelectItem>
                    <SelectItem value="RESOURCE">Resource</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newItemPriority} onValueChange={setNewItemPriority}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URGENT">🔥 Urgent</SelectItem>
                    <SelectItem value="HIGH">⚡ High</SelectItem>
                    <SelectItem value="NORMAL">🔵 Normal</SelectItem>
                    <SelectItem value="LOW">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateItem} disabled={!newItemTitle.trim() || inboxLoading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 gap-1">
            <TabsTrigger value="inbox" className="flex flex-col gap-1 p-2">
              <Inbox className="h-4 w-4" />
              <span className="text-xs">Inbox</span>
              {unprocessedItems.length > 0 && (
                <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
                  {unprocessedItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col gap-1 p-2">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex flex-col gap-1 p-2">
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex flex-col gap-1 p-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="srs" className="flex flex-col gap-1 p-2">
              <RotateCcw className="h-4 w-4" />
              <span className="text-xs">SRS</span>
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex flex-col gap-1 p-2">
              <Target className="h-4 w-4" />
              <span className="text-xs">Areas</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex flex-col gap-1 p-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Reviews</span>
            </TabsTrigger>
          </TabsList>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <Input 
                placeholder="Search inbox..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Unprocessed Items */}
            {unprocessedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      Unprocessed ({unprocessedItems.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unprocessedItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          {item.quickNote && (
                            <p className="text-sm text-muted-foreground mt-1">{item.quickNote}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                              {getPriorityIcon(item.priority)} {item.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProcessItem(item.id)}
                            disabled={inboxLoading}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteInboxItem(item.id)}
                            disabled={inboxLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processed Items */}
            {processedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Processed ({processedItems.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {processedItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg opacity-60">
                        <div className="flex-1">
                          <p className="font-medium line-through">{item.title}</p>
                          {item.quickNote && (
                            <p className="text-sm text-muted-foreground mt-1">{item.quickNote}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                              {getPriorityIcon(item.priority)} {item.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteInboxItem(item.id)}
                          disabled={inboxLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {filteredInboxItems.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your inbox is empty</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery ? 'No items match your search.' : 'Capture your first thought using the form above.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {/* Task Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input 
                    placeholder="Task name..."
                    className="w-full"
                    id="task-name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="TASK">
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TASK">Task</SelectItem>
                        <SelectItem value="PROJECT">Project</SelectItem>
                        <SelectItem value="MILESTONE">Milestone</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="P3_MEDIUM">
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P1_CRITICAL">P1-Critical</SelectItem>
                        <SelectItem value="P2_HIGH">P2-High</SelectItem>
                        <SelectItem value="P3_MEDIUM">P3-Medium</SelectItem>
                        <SelectItem value="P4_LOW">P4-Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="NOT_STARTED">
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="COMPLETE">Complete</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="MEDIUM">
                      <SelectTrigger>
                        <SelectValue placeholder="Energy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH_FOCUS">🧠 High Focus</SelectItem>
                        <SelectItem value="MEDIUM">💪 Medium</SelectItem>
                        <SelectItem value="LOW">🎮 Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => {
                      const name = (document.getElementById('task-name') as HTMLInputElement)?.value
                      if (name?.trim()) {
                        createTask({
                          name: name.trim(),
                          type: 'TASK' as any,
                          priority: 'P3_MEDIUM' as any,
                          status: 'NOT_STARTED' as any,
                          dueDate: null,
                          energyRequired: 'MEDIUM' as any,
                          context: null,
                          timeEstimate: null,
                          actualTime: null,
                          nextAction: null,
                          notes: null,
                          projectId: null
                        })
                        ;(document.getElementById('task-name') as HTMLInputElement).value = ''
                      }
                    }}
                    disabled={tasksLoading}
                  >
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Task Filters */}
            <div className="flex gap-2">
              <Select onValueChange={(value) => fetchTasks({ status: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="COMPLETE">Complete</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => fetchTasks({ priority: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priority</SelectItem>
                  <SelectItem value="P1_CRITICAL">P1-Critical</SelectItem>
                  <SelectItem value="P2_HIGH">P2-High</SelectItem>
                  <SelectItem value="P3_MEDIUM">P3-Medium</SelectItem>
                  <SelectItem value="P4_LOW">P4-Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tasks List */}
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{task.name}</h3>
                          {task.nextAction && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Next: {task.nextAction}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                            <Badge className={`text-xs ${getTaskPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs ${getTaskStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {task.energyRequired.replace('_', ' ')}
                            </Badge>
                            {task.dueDate && (
                              <Badge variant="outline" className="text-xs">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </Badge>
                            )}
                            {task.timeEstimate && (
                              <Badge variant="outline" className="text-xs">
                                {task.timeEstimate}min
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const newStatus = task.status === 'COMPLETE' ? 'NOT_STARTED' : 
                                              task.status === 'NOT_STARTED' ? 'IN_PROGRESS' :
                                              task.status === 'IN_PROGRESS' ? 'COMPLETE' : 'NOT_STARTED'
                              updateTask(task.id, { status: newStatus as any })
                            }}
                            disabled={tasksLoading}
                          >
                            {task.status === 'COMPLETE' ? '↶' : 
                             task.status === 'NOT_STARTED' ? '▶' :
                             task.status === 'IN_PROGRESS' ? '✓' : '↶'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteTask(task.id)}
                            disabled={tasksLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground text-center">
                    Create your first task using the form above.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ideas" className="space-y-4">
            {/* Idea Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Capture New Idea
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input 
                    placeholder="Idea title..."
                    className="w-full"
                    id="idea-title"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="PERSONAL">
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                        <SelectItem value="CREATIVE">Creative</SelectItem>
                        <SelectItem value="TECHNICAL">Technical</SelectItem>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="RESEARCH">Research</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="MEDIUM">
                      <SelectTrigger>
                        <SelectValue placeholder="Impact" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEN_X">10x Impact</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="MEDIUM">
                      <SelectTrigger>
                        <SelectValue placeholder="Effort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMALL">Small</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LARGE">Large</SelectItem>
                        <SelectItem value="MASSIVE">Massive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="SEED">
                      <SelectTrigger>
                        <SelectValue placeholder="Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEED">🌱 Seed</SelectItem>
                        <SelectItem value="SPROUTING">🌿 Sprouting</SelectItem>
                        <SelectItem value="GROWING">🌳 Growing</SelectItem>
                        <SelectItem value="HARVEST">🍎 Harvest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea 
                    placeholder="Initial thoughts or notes..."
                    className="w-full"
                    id="idea-notes"
                    rows={2}
                  />
                  <Button 
                    onClick={() => {
                      const title = (document.getElementById('idea-title') as HTMLInputElement)?.value
                      const notes = (document.getElementById('idea-notes') as HTMLTextAreaElement)?.value
                      if (title?.trim()) {
                        createIdea({
                          title: title.trim(),
                          category: 'PERSONAL' as any,
                          potentialImpact: 'MEDIUM' as any,
                          effortRequired: 'MEDIUM' as any,
                          stage: 'SEED' as any,
                          nextExperiment: null,
                          successMetrics: null,
                          notes: notes || null
                        })
                        ;(document.getElementById('idea-title') as HTMLInputElement).value = ''
                        ;(document.getElementById('idea-notes') as HTMLTextAreaElement).value = ''
                      }
                    }}
                    disabled={ideasLoading}
                  >
                    Capture Idea
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Idea Filters */}
            <div className="flex gap-2">
              <Select onValueChange={(value) => fetchIdeas({ stage: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stages</SelectItem>
                  <SelectItem value="SEED">🌱 Seed</SelectItem>
                  <SelectItem value="SPROUTING">🌿 Sprouting</SelectItem>
                  <SelectItem value="GROWING">🌳 Growing</SelectItem>
                  <SelectItem value="HARVEST">🍎 Harvest</SelectItem>
                  <SelectItem value="DORMANT">❄️ Dormant</SelectItem>
                  <SelectItem value="PRUNED">❌ Pruned</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => fetchIdeas({ impact: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Impact</SelectItem>
                  <SelectItem value="TEN_X">10x Impact</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ideas List */}
            {ideas.length > 0 ? (
              <div className="space-y-3">
                {ideas.map((idea) => (
                  <Card key={idea.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{idea.title}</h3>
                          {idea.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {idea.notes}
                            </p>
                          )}
                          {idea.nextExperiment && (
                            <p className="text-sm text-blue-600 mt-1">
                              💡 Next: {idea.nextExperiment}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge className={`text-xs ${getIdeaStageColor(idea.stage)}`}>
                              {getIdeaStageIcon(idea.stage)} {idea.stage}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {idea.category}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(idea.potentialImpact)}`}>
                              {idea.potentialImpact}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {idea.effortRequired}
                            </Badge>
                            {idea.reviewCount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                👁️ {idea.reviewCount} reviews
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => advanceIdeaStage(idea.id)}
                            disabled={ideasLoading}
                            title="Advance stage"
                          >
                            →
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteIdea(idea.id)}
                            disabled={ideasLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
                  <p className="text-muted-foreground text-center">
                    Capture your first idea using the form above.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            {/* Knowledge Item Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Knowledge Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input 
                    placeholder="Title..."
                    className="w-full"
                    id="knowledge-title"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="ARTICLE">
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARTICLE">Article</SelectItem>
                        <SelectItem value="BOOK">Book</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="COURSE">Course</SelectItem>
                        <SelectItem value="PODCAST">Podcast</SelectItem>
                        <SelectItem value="PAPER">Paper</SelectItem>
                        <SelectItem value="PERSONAL_NOTE">Personal Note</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="TO_PROCESS">
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TO_PROCESS">To Process</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="PROCESSED">Processed</SelectItem>
                        <SelectItem value="REFERENCE">Reference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="Author/Creator (optional)"
                      className="w-full"
                      id="knowledge-author"
                    />
                    <Input 
                      placeholder="Source URL (optional)"
                      className="w-full"
                      id="knowledge-url"
                    />
                  </div>
                  <Select defaultValue="GOOD">
                    <SelectTrigger>
                      <SelectValue placeholder="Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EVERGREEN">🏆 Evergreen</SelectItem>
                      <SelectItem value="GOOD">📗 Good</SelectItem>
                      <SelectItem value="OKAY">📙 Okay</SelectItem>
                      <SelectItem value="POOR">📕 Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea 
                    placeholder="Original notes while consuming..."
                    className="w-full"
                    id="knowledge-original"
                    rows={3}
                  />
                  <Textarea 
                    placeholder="Permanent notes in your own words..."
                    className="w-full"
                    id="knowledge-permanent"
                    rows={3}
                  />
                  <Button 
                    onClick={() => {
                      const title = (document.getElementById('knowledge-title') as HTMLInputElement)?.value
                      const author = (document.getElementById('knowledge-author') as HTMLInputElement)?.value
                      const url = (document.getElementById('knowledge-url') as HTMLInputElement)?.value
                      const original = (document.getElementById('knowledge-original') as HTMLTextAreaElement)?.value
                      const permanent = (document.getElementById('knowledge-permanent') as HTMLTextAreaElement)?.value
                      
                      if (title?.trim()) {
                        createKnowledgeItem({
                          title: title.trim(),
                          type: 'ARTICLE' as any,
                          status: 'TO_PROCESS' as any,
                          sourceUrl: url || null,
                          author: author || null,
                          dateConsumed: new Date(),
                          keyConcepts: null,
                          permanentNotes: permanent || null,
                          originalNotes: original || null,
                          quality: 'GOOD' as any,
                          tags: null
                        })
                        
                        // Reset form
                        ;(document.getElementById('knowledge-title') as HTMLInputElement).value = ''
                        ;(document.getElementById('knowledge-author') as HTMLInputElement).value = ''
                        ;(document.getElementById('knowledge-url') as HTMLInputElement).value = ''
                        ;(document.getElementById('knowledge-original') as HTMLTextAreaElement).value = ''
                        ;(document.getElementById('knowledge-permanent') as HTMLTextAreaElement).value = ''
                      }
                    }}
                    disabled={knowledgeLoading}
                  >
                    Add Knowledge Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Filters */}
            <div className="flex gap-2">
              <Select onValueChange={(value) => fetchKnowledgeItems({ status: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="TO_PROCESS">To Process</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PROCESSED">Processed</SelectItem>
                  <SelectItem value="REFERENCE">Reference</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => fetchKnowledgeItems({ quality: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Quality</SelectItem>
                  <SelectItem value="EVERGREEN">🏆 Evergreen</SelectItem>
                  <SelectItem value="GOOD">📗 Good</SelectItem>
                  <SelectItem value="OKAY">📙 Okay</SelectItem>
                  <SelectItem value="POOR">📕 Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Knowledge Items List */}
            {knowledgeItems.length > 0 ? (
              <div className="space-y-3">
                {knowledgeItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.author && (
                            <p className="text-sm text-muted-foreground mt-1">
                              By: {item.author}
                            </p>
                          )}
                          {item.sourceUrl && (
                            <p className="text-sm text-blue-600 mt-1">
                              🔗 Source
                            </p>
                          )}
                          {item.originalNotes && (
                            <details className="mt-2">
                              <summary className="text-sm cursor-pointer text-muted-foreground">Original notes</summary>
                              <p className="text-sm mt-1 p-2 bg-muted rounded">{item.originalNotes}</p>
                            </details>
                          )}
                          {item.permanentNotes && (
                            <details className="mt-2">
                              <summary className="text-sm cursor-pointer text-muted-foreground">Permanent notes</summary>
                              <p className="text-sm mt-1 p-2 bg-green-50 rounded">{item.permanentNotes}</p>
                            </details>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge className={`text-xs ${getKnowledgeStatusColor(item.status)}`}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <Badge className={`text-xs ${getKnowledgeQualityColor(item.quality)}`}>
                              {item.quality}
                            </Badge>
                            {item.dateConsumed && (
                              <Badge variant="secondary" className="text-xs">
                                {new Date(item.dateConsumed).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => processKnowledgeItem(item.id)}
                            disabled={knowledgeLoading}
                            title="Process item"
                          >
                            →
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteKnowledgeItem(item.id)}
                            disabled={knowledgeLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No knowledge items yet</h3>
                  <p className="text-muted-foreground text-center">
                    Add your first knowledge item using the form above.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="srs" className="space-y-4">
            {/* SRS Card Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Flashcard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input 
                    placeholder="Question/Prompt..."
                    className="w-full"
                    id="srs-question"
                  />
                  <Textarea 
                    placeholder="Answer/Response..."
                    className="w-full"
                    id="srs-answer"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="FACT">
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACT">Fact</SelectItem>
                        <SelectItem value="CONCEPT">Concept</SelectItem>
                        <SelectItem value="PROCESS">Process</SelectItem>
                        <SelectItem value="CONNECTION">Connection</SelectItem>
                        <SelectItem value="PROBLEM">Problem</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="MEDIUM">
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea 
                    placeholder="Context or examples (optional)..."
                    className="w-full"
                    id="srs-context"
                    rows={2}
                  />
                  <Textarea 
                    placeholder="Why this matters (optional)..."
                    className="w-full"
                    id="srs-why"
                    rows={2}
                  />
                  <Button 
                    onClick={() => {
                      const question = (document.getElementById('srs-question') as HTMLInputElement)?.value
                      const answer = (document.getElementById('srs-answer') as HTMLTextAreaElement)?.value
                      const context = (document.getElementById('srs-context') as HTMLTextAreaElement)?.value
                      const whyMatters = (document.getElementById('srs-why') as HTMLTextAreaElement)?.value
                      
                      if (question?.trim() && answer?.trim()) {
                        createSRSCard({
                          question: question.trim(),
                          answer: answer.trim(),
                          type: 'FACT' as any,
                          difficulty: 'MEDIUM' as any,
                          sourceId: null,
                          context: context || null,
                          whyMatters: whyMatters || null
                        })
                        
                        // Reset form
                        ;(document.getElementById('srs-question') as HTMLInputElement).value = ''
                        ;(document.getElementById('srs-answer') as HTMLTextAreaElement).value = ''
                        ;(document.getElementById('srs-context') as HTMLTextAreaElement).value = ''
                        ;(document.getElementById('srs-why') as HTMLTextAreaElement).value = ''
                      }
                    }}
                    disabled={srsLoading}
                  >
                    Create Flashcard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SRS Filters */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => fetchSRSCards({ dueToday: true })}
              >
                Today's Review ({srsCards.filter(card => new Date(card.nextReviewDate) <= new Date()).length})
              </Button>
              <Select onValueChange={(value) => fetchSRSCards({ type: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="FACT">Fact</SelectItem>
                  <SelectItem value="CONCEPT">Concept</SelectItem>
                  <SelectItem value="PROCESS">Process</SelectItem>
                  <SelectItem value="CONNECTION">Connection</SelectItem>
                  <SelectItem value="PROBLEM">Problem</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => fetchSRSCards({ difficulty: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Difficulty</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SRS Cards List */}
            {srsCards.length > 0 ? (
              <div className="space-y-3">
                {srsCards.map((card) => (
                  <Card key={card.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{card.question}</h3>
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground">Show answer</summary>
                            <p className="text-sm mt-2 p-2 bg-green-50 rounded font-medium">{card.answer}</p>
                          </details>
                          {card.context && (
                            <details className="mt-2">
                              <summary className="text-sm cursor-pointer text-muted-foreground">Context</summary>
                              <p className="text-sm mt-1 p-2 bg-blue-50 rounded">{card.context}</p>
                            </details>
                          )}
                          {card.whyMatters && (
                            <details className="mt-2">
                              <summary className="text-sm cursor-pointer text-muted-foreground">Why it matters</summary>
                              <p className="text-sm mt-1 p-2 bg-yellow-50 rounded">{card.whyMatters}</p>
                            </details>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {card.type}
                            </Badge>
                            <Badge className={`text-xs ${getSRSDifficultyColor(card.difficulty)}`}>
                              {card.difficulty}
                            </Badge>
                            <Badge className={`text-xs ${getUnderstandingLevelColor(card.understandingLevel)}`}>
                              {card.understandingLevel}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Interval: {card.interval}d
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Reviews: {card.repetitionCount}
                            </Badge>
                            {new Date(card.nextReviewDate) <= new Date() ? (
                              <Badge variant="destructive" className="text-xs">
                                Due Today
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Review: {new Date(card.nextReviewDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <div className="flex flex-col gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => reviewCard(card.id, 'PERFECT')}
                              disabled={srsLoading}
                              title="Perfect"
                              className="text-xs"
                            >
                              ✓✓
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => reviewCard(card.id, 'GOOD')}
                              disabled={srsLoading}
                              title="Good"
                              className="text-xs"
                            >
                              ✓
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => reviewCard(card.id, 'HARD')}
                              disabled={srsLoading}
                              title="Hard"
                              className="text-xs"
                            >
                              △
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => reviewCard(card.id, 'AGAIN')}
                              disabled={srsLoading}
                              title="Again"
                              className="text-xs"
                            >
                              ✗
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteSRSCard(card.id)}
                            disabled={srsLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <RotateCcw className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                  <p className="text-muted-foreground text-center">
                    Create your first flashcard using the form above.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="areas" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Life Areas</h3>
                <p className="text-muted-foreground text-center">
                  Coming soon! Balance your life across key areas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Reviews & Reflection</h3>
                <p className="text-muted-foreground text-center">
                  Coming soon! Reflect and optimize your system.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-around px-4">
          <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
            <Inbox className="h-4 w-4" />
            <span className="text-xs">Inbox</span>
            {unprocessedItems.length > 0 && (
              <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
                {unprocessedItems.length}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
            <CheckSquare className="h-4 w-4" />
            <span className="text-xs">Tasks</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
            <Plus className="h-4 w-4" />
            <span className="text-xs">Add</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
            <Brain className="h-4 w-4" />
            <span className="text-xs">Learn</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Review</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}// Trigger deployment
