"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Loader2 } from "lucide-react"
import { useBooks } from "@/hooks/useBooks"

export default function BookList() {
  const { books, loading, error } = useBooks()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Book Library</h1>
        </div>
        <Link href="/books/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-1">{book.title}</CardTitle>
              <CardDescription>by {book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {book.genre && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Genre:</span> {book.genre}
                  </p>
                )}
                {book.publishedYear && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Published:</span> {book.publishedYear}
                  </p>
                )}
                {book.description && <p className="text-sm line-clamp-3">{book.description}</p>}
              </div>
              <div className="flex gap-2">
                <Link href={`/books/${book._id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Link href={`/books/${book._id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first book to the library.</p>
          <Link href="/books/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Book
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
