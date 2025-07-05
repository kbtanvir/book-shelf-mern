import mongoose from "mongoose"

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [100, "Author name cannot be more than 100 characters"],
    },
    genre: {
      type: String,
      trim: true,
      maxlength: [50, "Genre cannot be more than 50 characters"],
    },
    publishedYear: {
      type: Number,
      min: [1000, "Published year must be at least 1000"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    pages: {
      type: Number,
      min: [1, "Pages must be at least 1"],
      max: [10000, "Pages cannot exceed 10000"],
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      validate: {
        validator: (v) => {
          if (!v) return true
          return /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(
            v,
          )
        },
        message: "Please enter a valid ISBN",
      },
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: [100, "Publisher name cannot be more than 100 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
BookSchema.index({ title: "text", author: "text", description: "text" })
BookSchema.index({ genre: 1 })
BookSchema.index({ publishedYear: 1 })

export default mongoose.model("Book", BookSchema)
