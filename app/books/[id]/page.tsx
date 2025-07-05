"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Calendar, BookOpen, User, Building, Hash, Loader2, MoreVertical } from "lucide-react"
import { useBook } from "@/hooks/useBooks"
import { apiService } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookPage({ params }: BookPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { book, loading, error } = useBook(resolvedParams.id)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiService.deleteBook(resolvedParams.id)
      router.push("/")
    } catch (error) {
      console.error("Error deleting book:", error)
      setDeleting(false)
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
          <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist.</p>
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
      {/* Header with Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2 sm:px-4">
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Library</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-6">
        {/* Mobile Cover Image */}
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full max-w-xs mx-auto">
              {book.coverImageUrl ? (
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={book.coverImageUrl || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center hidden">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Book Info */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl leading-tight mb-2">{book.title}</CardTitle>
                <div className="flex items-center gap-2 text-base text-muted-foreground mb-3">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">by {book.author}</span>
                </div>
                {book.genre && (
                  <Badge variant="secondary" className="text-xs">
                    {book.genre}
                  </Badge>
                )}
              </div>

              {/* Mobile Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/books/${book._id}/edit`} className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Book
                    </Link>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Book
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete "{book.title}" from your library.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                          disabled={deleting}
                        >
                          {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Delete Book
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {book.description && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">Description</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{book.description}</p>
              </div>
            )}

            <Separator />

            {/* Mobile Book Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Book Details</h3>
              <div className="space-y-2">
                {book.publishedYear && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Published</span>
                    </div>
                    <span className="text-sm font-medium">{book.publishedYear}</span>
                  </div>
                )}
                {book.pages && book.pages > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Pages</span>
                    </div>
                    <span className="text-sm font-medium">{book.pages}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Publisher</span>
                    </div>
                    <span className="text-sm font-medium truncate ml-2">{book.publisher}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">ISBN</span>
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{book.isbn}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Added: {new Date(book.createdAt).toLocaleDateString()}</p>
              {book.updatedAt !== book.createdAt && (
                <p>Last updated: {new Date(book.updatedAt).toLocaleDateString()}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden lg:block">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Desktop Cover Image */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {book.coverImageUrl ? (
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={book.coverImageUrl || "/placeholder.svg"}
                      alt={`Cover of ${book.title}`}
                      fill
                      className="object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = "flex"
                      }}
                    />
                    <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center hidden">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Desktop Book Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                    <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
                      <User className="h-4 w-4" />
                      <span>by {book.author}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/books/${book._id}/edit`}>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" disabled={deleting}>
                          {deleting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete "{book.title}" from your library.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete Book
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
              </CardHeader>
              <CardContent className="space-y-6">
                {book.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                  </div>
                )}

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  {book.publishedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Published: {book.publishedYear}</span>
                    </div>
                  )}
                  {book.pages && book.pages > 0 && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{book.pages} pages</span>
                    </div>
                  )}
                  {book.publisher && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Publisher: {book.publisher}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">ISBN: {book.isbn}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  <p>Added: {new Date(book.createdAt).toLocaleDateString()}</p>
                  {book.updatedAt !== book.createdAt && (
                    <p>Last updated: {new Date(book.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
