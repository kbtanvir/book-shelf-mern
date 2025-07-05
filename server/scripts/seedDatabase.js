import mongoose from "mongoose"
import dotenv from "dotenv"
import Book from "../models/Book.js"

dotenv.config()

// Sample books data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    publishedYear: 1925,
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream. The story follows Nick Carraway as he observes the tragic story of Jay Gatsby and his obsessive pursuit of Daisy Buchanan.",
    pages: 180,
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    publishedYear: 1960,
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South. The story is told through the eyes of Scout Finch, whose father Atticus defends a black man falsely accused of rape.",
    pages: 376,
    isbn: "978-0-06-112008-4",
    publisher: "J.B. Lippincott & Co.",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    publishedYear: 1949,
    description:
      "A dystopian social science fiction novel about totalitarian control and surveillance. Set in a world where Big Brother watches everything and the Party controls all aspects of life.",
    pages: 328,
    isbn: "978-0-452-28423-4",
    publisher: "Secker & Warburg",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    publishedYear: 1813,
    description:
      "A romantic novel that critiques the British landed gentry at the end of the 18th century. The story follows Elizabeth Bennet and her complex relationship with the proud Mr. Darcy.",
    pages: 432,
    isbn: "978-0-14-143951-8",
    publisher: "T. Egerton",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Coming-of-age Fiction",
    publishedYear: 1951,
    description:
      "A controversial novel about teenage rebellion and alienation, following Holden Caulfield's experiences in New York City after being expelled from prep school.",
    pages: 277,
    isbn: "978-0-316-76948-0",
    publisher: "Little, Brown and Company",
  },
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing books
    await Book.deleteMany({})
    console.log("Cleared existing books")

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks)
    console.log(`Inserted ${insertedBooks.length} sample books`)

    // Display inserted books
    console.log("\nInserted books:")
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author}`)
    })

    console.log("\nDatabase seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding function
seedDatabase()
