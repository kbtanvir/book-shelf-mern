import rateLimit from "express-rate-limit"

// Rate limiting middleware
export const createRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for create/update/delete
  message: {
    error: "Too many modification requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})
