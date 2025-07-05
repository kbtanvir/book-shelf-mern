"use client"

import { useState, useEffect } from "react"
import { apiService, type Book, type BookResponse } from "@/lib/api"

export function useBooks(params?: {
  page?: number
  limit?: number
  search?: string
  genre?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  const [data, setData] = useState<BookResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getBooks(params)
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [params?.page, params?.limit, params?.search, params?.genre, params?.sortBy, params?.sortOrder])

  return {
    books: data?.books || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchBooks,
  }
}

export function useBook(id: string) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getBook(id)
        setBook(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  return { book, loading, error }
}
