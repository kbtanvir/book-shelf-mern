"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useBook } from "@/hooks/useBooks"
import { apiService } from "@/lib/api"

interface EditBookPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { book, loading, error } = useBook(resolvedParams.id)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    coverImageUrl: "",
    description: "",
    publishedYear: new Date().getFullYear(),
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        coverImageUrl: book.coverImageUrl || "",
        description: book.description || "",
        publishedYear: book.publishedYear || new Date().getFullYear(),
      })
    }
  }, [book])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    try {
      await apiService.updateBook(resolvedParams.id, formData)
      router.push(`/books/${resolvedParams.id}`)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {}
        error.response.data.errors.forEach((err: any) => {
          fieldErrors[err.path] = err.msg
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: error.response?.data?.message || "Failed to update book" })
      }
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "publishedYear" ? Number.parseInt(value) || new Date().getFullYear() : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading book...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-4">The book you're trying to edit doesn't exist.</p>
          <Link href="/">
            <Button size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Link href={`/books/${resolvedParams.id}`}>
          <Button variant="ghost" size="sm" className="p-2 sm:px-4">
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Book</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Edit Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {errors.general}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
                required
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                name="author"
                type="text"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? "border-red-500" : ""}
                required
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium">
                Genre
              </Label>
              <Input
                id="genre"
                name="genre"
                type="text"
                placeholder="Enter book genre"
                value={formData.genre}
                onChange={handleChange}
                className={errors.genre ? "border-red-500" : ""}
              />
              {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl" className="text-sm font-medium">
                Cover Image URL
              </Label>
              <Input
                id="coverImageUrl"
                name="coverImageUrl"
                type="url"
                placeholder="Enter cover image URL (optional)"
                value={formData.coverImageUrl}
                onChange={handleChange}
                className={errors.coverImageUrl ? "border-red-500" : ""}
              />
              {errors.coverImageUrl && <p className="text-red-500 text-xs mt-1">{errors.coverImageUrl}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter book description"
                value={formData.description}
                onChange={handleChange}
                className={`min-h-[120px] resize-none ${errors.description ? "border-red-500" : ""}`}
                rows={5}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Published Year */}
            <div className="space-y-2">
              <Label htmlFor="publishedYear" className="text-sm font-medium">
                Published Year
              </Label>
              <Input
                id="publishedYear"
                name="publishedYear"
                type="number"
                placeholder="2025"
                value={formData.publishedYear}
                onChange={handleChange}
                className={errors.publishedYear ? "border-red-500" : ""}
                min="1000"
                max={new Date().getFullYear() + 10}
              />
              {errors.publishedYear && <p className="text-red-500 text-xs mt-1">{errors.publishedYear}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Book...
                  </>
                ) : (
                  "Update Book"
                )}
              </Button>
              <Link href={`/books/${resolvedParams.id}`}>
                <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
