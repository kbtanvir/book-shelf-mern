"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { useBook } from "@/hooks/useBooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { apiService } from "@/lib/api"

interface BookPageProps {
  params: {
    id: string
  }
}

export default function BookPage({ params }: BookPageProps) {
  const { book, loading, error } = useBook(params.id)
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return
    }

    try {
      setDeleting(true)
      await apiService.deleteBook(params.id)
      router.push("/")
    } catch (error) {
      alert("Failed to delete book. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    )
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

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{book.title}</CardTitle>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
              <div className="flex items-center gap-2">
                {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
                {book.publishedYear && <Badge variant="outline">{book.publishedYear}</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/books/${book._id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {book.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Book Details</h3>
              <div className="space-y-2">
                {book.pages && (
                  <div className="flex justify-between">
                    <span className="font-medium">Pages:</span>
                    <span>{book.pages}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="font-medium">ISBN:</span>
                    <span className="font-mono text-sm">{book.isbn}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex justify-between">
                    <span className="font-medium">Publisher:</span>
                    <span>{book.publisher}</span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex justify-between">
                    <span className="font-medium">Published:</span>
                    <span>{book.publishedYear}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Metadata</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Added:</span>
                  <span className="text-sm">{new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Updated:</span>
                  <span className="text-sm">{new Date(book.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
