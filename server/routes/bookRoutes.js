import express from "express"
import { body } from "express-validator"
import { getBooks, getBook, createBook, updateBook, deleteBook } from "../controllers/bookController.js"

const router = express.Router()

// Validation middleware
const bookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot be more than 200 characters"),
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ max: 100 })
    .withMessage("Author name cannot be more than 100 characters"),
  body("genre").optional().trim().isLength({ max: 50 }).withMessage("Genre cannot be more than 50 characters"),
  body("publishedYear")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage("Published year must be between 1000 and current year"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot be more than 2000 characters"),
  body("pages").optional().isInt({ min: 1, max: 10000 }).withMessage("Pages must be between 1 and 10000"),
  body("isbn")
    .optional()
    .trim()
    .matches(
      /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
    )
    .withMessage("Please enter a valid ISBN"),
  body("publisher")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Publisher name cannot be more than 100 characters"),
]

// Routes
router.route("/").get(getBooks).post(bookValidation, createBook)

router.route("/:id").get(getBook).put(bookValidation, updateBook).delete(deleteBook)

export default router
