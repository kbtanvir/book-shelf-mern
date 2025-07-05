import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import bookRoutes from "./routes/bookRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import { createRateLimit } from "./middleware/rateLimiter.js"

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Security middleware
app.use(helmet())

// Rate limiting
app.use(createRateLimit)

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: false }))

// Routes
app.use("/api/books", bookRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Book API Server is running",
    timestamp: new Date().toISOString(),
  })
})

// Error handler
app.use(errorHandler)

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  })
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => {
    process.exit(1)
  })
})
