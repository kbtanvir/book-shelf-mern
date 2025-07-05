"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"

interface FieldError {
  field: string
  message: string
}

export default function AddBookPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([])

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    coverImageUrl: "",
    description: "",
    publishedYear: new Date().getFullYear(),
    pages: 0,
    isbn: "",
    publisher: "",
  })

  const getFieldError = (fieldName: string) => {
    return fieldErrors.find((error) => error.field === fieldName)?.message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    setFieldErrors([])

    try {
      await apiService.createBook(formData)
      router.push("/")
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message

        // Try to parse validation errors
        if (errorMessage.includes("Validation failed")) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/books`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            })
            const errorData = await response.json()

            if (errorData.details && Array.isArray(errorData.details)) {
              const errors: FieldError[] = errorData.details.map((detail: string) => {
                // Parse field name from error message
                let field = "general"
                if (detail.includes("Title")) field = "title"
                else if (detail.includes("Author")) field = "author"
                else if (detail.includes("Genre")) field = "genre"
                else if (detail.includes("Cover") || detail.includes("image")) field = "coverImageUrl"
                else if (detail.includes("Description")) field = "description"
                else if (detail.includes("Published") || detail.includes("year")) field = "publishedYear"
                else if (detail.includes("Pages")) field = "pages"
                else if (detail.includes("ISBN")) field = "isbn"
                else if (detail.includes("Publisher")) field = "publisher"

                return { field, message: detail }
              })
              setFieldErrors(errors)
            } else {
              setFormError(errorMessage)
            }
          } catch {
            setFormError(errorMessage)
          }
        } else {
          setFormError(errorMessage)
        }
      } else {
        setFormError("An error occurred")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "publishedYear" || name === "pages" ? Number.parseInt(value) || 0 : value,
    }))

    // Clear field error when user starts typing
    setFieldErrors((prev) => prev.filter((error) => error.field !== name))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{formError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                className={getFieldError("title") ? "border-red-500" : ""}
              />
              {getFieldError("title") && <p className="text-sm text-red-600 mt-1">{getFieldError("title")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className={getFieldError("author") ? "border-red-500" : ""}
              />
              {getFieldError("author") && <p className="text-sm text-red-600 mt-1">{getFieldError("author")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Enter book genre"
                className={getFieldError("genre") ? "border-red-500" : ""}
              />
              {getFieldError("genre") && <p className="text-sm text-red-600 mt-1">{getFieldError("genre")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                placeholder="Enter cover image URL (optional)"
                type="url"
                className={getFieldError("coverImageUrl") ? "border-red-500" : ""}
              />
              {getFieldError("coverImageUrl") && (
                <p className="text-sm text-red-600 mt-1">{getFieldError("coverImageUrl")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter book description"
                className={getFieldError("description") ? "border-red-500" : ""}
              />
              {getFieldError("description") && (
                <p className="text-sm text-red-600 mt-1">{getFieldError("description")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input
                id="publishedYear"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className={getFieldError("publishedYear") ? "border-red-500" : ""}
              />
              {getFieldError("publishedYear") && (
                <p className="text-sm text-red-600 mt-1">{getFieldError("publishedYear")}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  min="1"
                  className={getFieldError("pages") ? "border-red-500" : ""}
                />
                {getFieldError("pages") && <p className="text-sm text-red-600 mt-1">{getFieldError("pages")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="978-0-123456-78-9"
                  className={getFieldError("isbn") ? "border-red-500" : ""}
                />
                {getFieldError("isbn") && <p className="text-sm text-red-600 mt-1">{getFieldError("isbn")}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className={getFieldError("publisher") ? "border-red-500" : ""}
              />
              {getFieldError("publisher") && <p className="text-sm text-red-600 mt-1">{getFieldError("publisher")}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Book
              </Button>
              <Link href="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
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
