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

interface McqEditorProps {
  userId: string
  mcq?: {
    id: string
    title: string
    content: string
    explanation: string | null
    correctAnswer: string
    options: string[]
    difficulty: string | null
    topic: string | null
    tags: string[]
  }
}

export function McqEditor({ userId, mcq }: McqEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(mcq?.title || "")
  const [content, setContent] = useState(mcq?.content || "")
  const [explanation, setExplanation] = useState(mcq?.explanation || "")
  const [correctAnswer, setCorrectAnswer] = useState(mcq?.correctAnswer || "")
  const [options, setOptions] = useState<string[]>(mcq?.options || ["", "", "", ""])
  const [difficulty, setDifficulty] = useState(mcq?.difficulty || "medium")
  const [topic, setTopic] = useState(mcq?.topic || "")
  const [tags, setTags] = useState(mcq?.tags?.join(", ") || "")

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
        explanation: explanation || null,
        correctAnswer,
        options: options.filter((opt) => opt.trim() !== ""),
        difficulty,
        topic: topic || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        createdBy: userId,
      }

      const url = mcq ? `/api/admin/mcqs/${mcq.id}` : "/api/admin/mcqs"
      const method = mcq ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save MCQ")
      }

      router.push("/admin/mcqs")
      router.refresh()
    } catch (error) {
      console.error("Error saving MCQ:", error)
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
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter question title"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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

      {/* Split Pane Editor for Question Content */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Question Content</h3>
            <p className="text-sm text-muted-foreground">Write your question using Markdown</p>
          </div>
          <div
            ref={containerRef}
            className="relative flex h-[400px]"
            style={{ userSelect: isDragging ? "none" : "auto" }}
          >
            {/* Editor Pane */}
            <div style={{ width: `${dividerPosition}%` }} className="overflow-hidden">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your question content here using Markdown..."
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

      {/* Answer Options */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-4">Answer Options</h3>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Label className="w-8">{String.fromCharCode(65 + index)}.</Label>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options]
                      newOptions[index] = e.target.value
                      setOptions(newOptions)
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctAnswer">Correct Answer</Label>
            <Select value={correctAnswer} onValueChange={setCorrectAnswer} required>
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {options.map((_, index) => (
                  <SelectItem key={index} value={String.fromCharCode(65 + index)}>
                    Option {String.fromCharCode(65 + index)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Split Pane Editor for Explanation */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Explanation (Optional)</h3>
            <p className="text-sm text-muted-foreground">Provide an explanation for the correct answer</p>
          </div>
          <div className="relative flex h-[300px]">
            {/* Editor Pane */}
            <div style={{ width: `${dividerPosition}%` }} className="overflow-hidden">
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Write your explanation here using Markdown..."
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {explanation || "*Preview will appear here...*"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mcq ? "Update MCQ" : "Create MCQ"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
