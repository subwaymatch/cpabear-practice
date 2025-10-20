"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, GripVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface SimEditorProps {
  userId: string
  sim?: {
    id: string
    title: string
    content: string
    solution: string | null
    difficulty: string | null
    topic: string | null
    tags: string[]
    estimatedTime: number | null
  }
}

export function SimEditor({ userId, sim }: SimEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(sim?.title || "")
  const [content, setContent] = useState(sim?.content || "")
  const [solution, setSolution] = useState(sim?.solution || "")
  const [difficulty, setDifficulty] = useState(sim?.difficulty || "medium")
  const [topic, setTopic] = useState(sim?.topic || "")
  const [tags, setTags] = useState(sim?.tags?.join(", ") || "")
  const [estimatedTime, setEstimatedTime] = useState(sim?.estimatedTime?.toString() || "")

  // Split pane state
  const [dividerPosition, setDividerPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100

      // Constrain between 20% and 80%
      setDividerPosition(Math.min(Math.max(newPosition, 20), 80))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        title,
        content,
        solution: solution || null,
        difficulty,
        topic: topic || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        estimatedTime: estimatedTime ? Number.parseInt(estimatedTime) : null,
        createdBy: userId,
      }

      const url = sim ? `/api/admin/sims/${sim.id}` : "/api/admin/sims"
      const method = sim ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save simulation")
      }

      router.push("/admin/sims")
      router.refresh()
    } catch (error) {
      console.error("Error saving simulation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Simulation Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter simulation title"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., FAR" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Est. Time (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., accounting, revenue"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Split Pane Editor for Simulation Content */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Simulation Content</h3>
            <p className="text-sm text-muted-foreground">Write your simulation scenario using Markdown</p>
          </div>
          <div
            ref={containerRef}
            className="relative flex h-[500px]"
            style={{ userSelect: isDragging ? "none" : "auto" }}
          >
            {/* Editor Pane */}
            <div style={{ width: `${dividerPosition}%` }} className="overflow-hidden">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your simulation content here using Markdown..."
                className="h-full resize-none rounded-none border-0 focus-visible:ring-0"
                required
              />
            </div>

            {/* Draggable Divider */}
            <div
              className="group relative flex w-2 cursor-col-resize items-center justify-center bg-border hover:bg-primary/20"
              onMouseDown={handleMouseDown}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>

            {/* Preview Pane */}
            <div style={{ width: `${100 - dividerPosition}%` }} className="overflow-auto bg-muted/30 p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Preview will appear here...*"}</ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Split Pane Editor for Solution */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Solution (Optional)</h3>
            <p className="text-sm text-muted-foreground">Provide the solution or answer key for this simulation</p>
          </div>
          <div className="relative flex h-[400px]">
            {/* Editor Pane */}
            <div style={{ width: `${dividerPosition}%` }} className="overflow-hidden">
              <Textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Write your solution here using Markdown..."
                className="h-full resize-none rounded-none border-0 focus-visible:ring-0"
              />
            </div>

            {/* Draggable Divider */}
            <div
              className="group relative flex w-2 cursor-col-resize items-center justify-center bg-border hover:bg-primary/20"
              onMouseDown={handleMouseDown}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>

            {/* Preview Pane */}
            <div style={{ width: `${100 - dividerPosition}%` }} className="overflow-auto bg-muted/30 p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{solution || "*Preview will appear here...*"}</ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {sim ? "Update Simulation" : "Create Simulation"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
