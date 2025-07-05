"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Loader2 } from "lucide-react"
import { useBooks } from "@/hooks/useBooks"
import Image from "next/image"

export default function BookList() {
  const { books, loading, error } = useBooks()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
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
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">{error}</p>
          <Button onClick={() => window.location.reload()} size="sm">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Book Library</h1>
        </div>
        <Link href="/books/add">
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

      {/* Responsive Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <Card key={book._id} className="hover:shadow-lg transition-shadow overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-40 sm:h-48 w-full bg-gray-100">
              {book.coverImageUrl ? (
                <Image
                  src={book.coverImageUrl || "/placeholder.svg"}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = "flex"
                  }}
                />
              ) : null}
              {/* Fallback when no image or image fails to load */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${
                  book.coverImageUrl ? "hidden" : "flex"
                }`}
              >
                <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              </div>
            </div>

            <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="line-clamp-2 text-base sm:text-lg leading-tight">{book.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">by {book.author}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
              <div className="space-y-1 mb-3 sm:mb-4">
                {book.genre && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Genre:</span> {book.genre}
                  </p>
                )}
                {book.publishedYear && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Published:</span> {book.publishedYear}
                  </p>
                )}
                {book.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{book.description}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link href={`/books/${book._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent text-xs sm:text-sm">
                    View Details
                  </Button>
                </Link>
                <Link href={`/books/${book._id}/edit`} className="flex-1 sm:flex-initial">
                  <Button variant="secondary" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
            Get started by adding your first book to the library.
          </p>
          <Link href="/books/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Book
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
