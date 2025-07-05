import Book from "../models/Book.js"
import { validationResult } from "express-validator"

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, genre, sortBy = "createdAt", sortOrder = "desc" } = req.query

    // Build query
    const query = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (genre) {
      query.genre = { $regex: genre, $options: "i" }
    }

    // Execute query with pagination
    const books = await Book.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    // Get total count for pagination
    const total = await Book.countDocuments(query)

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    res.status(500).json({ error: "Server error while fetching books" })
  }
}

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    res.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID" })
    }

    res.status(500).json({ error: "Server error while fetching book" })
  }
}

// @desc    Create new book
// @route   POST /api/books
// @access  Public
export const createBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array().map((err) => err.msg),
      })
    }

    const book = new Book(req.body)
    const savedBook = await book.save()

    res.status(201).json(savedBook)
  } catch (error) {
    console.error("Error creating book:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ error: "Validation failed", details: errors })
    }

    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return res.status(409).json({ error: "A book with this ISBN already exists" })
    }

    res.status(500).json({ error: "Server error while creating book" })
  }
}

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public
export const updateBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array().map((err) => err.msg),
      })
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    res.json(book)
  } catch (error) {
    console.error("Error updating book:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID" })
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ error: "Validation failed", details: errors })
    }

    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return res.status(409).json({ error: "A book with this ISBN already exists" })
    }

    res.status(500).json({ error: "Server error while updating book" })
  }
}

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID" })
    }

    res.status(500).json({ error: "Server error while deleting book" })
  }
}
