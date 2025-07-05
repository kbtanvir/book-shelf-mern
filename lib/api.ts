// API service for communicating with Express backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Book {
  _id: string
  title: string
  author: string
  genre?: string
  coverImageUrl?: string
  description?: string
  publishedYear?: number
  pages?: number
  isbn?: string
  publisher?: string
  createdAt: string
  updatedAt: string
}

export interface BookResponse {
  books: Book[]
  totalPages: number
  currentPage: number
  total: number
}

export interface CreateBookData {
  title: string
  author: string
  genre?: string
  coverImageUrl?: string
  description?: string
  publishedYear?: number
  pages?: number
  isbn?: string
  publisher?: string
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unexpected error occurred")
    }
  }

  // Book API methods
  async getBooks(params?: {
    page?: number
    limit?: number
    search?: string
    genre?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<BookResponse> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    const endpoint = `/books${queryString ? `?${queryString}` : ""}`

    return this.request<BookResponse>(endpoint)
  }

  async getBook(id: string): Promise<Book> {
    return this.request<Book>(`/books/${id}`)
  }

  async createBook(bookData: CreateBookData): Promise<Book> {
    return this.request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    })
  }

  async updateBook(id: string, bookData: Partial<CreateBookData>): Promise<Book> {
    return this.request<Book>(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    })
  }

  async deleteBook(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/books/${id}`, {
      method: "DELETE",
    })
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return this.request<{ success: boolean; message: string; timestamp: string }>("/health")
  }
}

export const apiService = new ApiService()
