import connectDB from "../config/database.js";
import Book from "../models/Book.js";

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    publishedYear: 1925,
    pages: 180,
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8226374-L.jpg",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South.",
    publishedYear: 1960,
    pages: 376,
    isbn: "978-0-06-112008-4",
    publisher: "J.B. Lippincott & Co.",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
    description:
      "A dystopian social science fiction novel about totalitarian control and surveillance.",
    publishedYear: 1949,
    pages: 328,
    isbn: "978-0-452-28423-4",
    publisher: "Secker & Warburg",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8226374-L.jpg",
    description:
      "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    publishedYear: 1813,
    pages: 432,
    isbn: "978-0-14-143951-8",
    publisher: "T. Egerton",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    description:
      "A controversial novel about teenage rebellion and alienation in post-war America.",
    publishedYear: 1951,
    pages: 277,
    isbn: "978-0-316-76948-0",
    publisher: "Little, Brown and Company",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();

    // Clear existing books
    console.log("🗑️  Clearing existing books...");
    await Book.deleteMany({});

    // Insert sample books
    console.log("📚 Inserting sample books...");
    const insertedBooks = await Book.insertMany(sampleBooks);

    console.log(`✅ Successfully seeded ${insertedBooks.length} books!`);
    console.log("\n📖 Seeded books:");
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
