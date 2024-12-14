import { z } from 'zod'

// Content validation schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(2, 'Comment is too short')
    .max(1000, 'Comment is too long')
    .refine((content) => !containsExcessiveLinks(content), {
      message: 'Too many links in comment',
    })
    .refine((content) => !containsProfanity(content), {
      message: 'Comment contains inappropriate content',
    })
    .refine((content) => !containsSpamPatterns(content), {
      message: 'Comment appears to be spam',
    }),
})

// Link detection
const URL_PATTERN = /https?:\/\/[^\s]+/g
const MAX_LINKS = 2

function containsExcessiveLinks(content: string): boolean {
  const links = content.match(URL_PATTERN) || []
  return links.length > MAX_LINKS
}

// Basic profanity filter - extend this list as needed
const PROFANITY_LIST = new Set([
  'spam',
  'scam',
  // Add more words as needed
])

function containsProfanity(content: string): boolean {
  const words = content.toLowerCase().split(/\s+/)
  return words.some(word => PROFANITY_LIST.has(word))
}

// Spam pattern detection
const SPAM_PATTERNS = [
  /\b(buy|sell|discount|offer)\b/gi,
  /\b(casino|gambling|bet)\b/gi,
  /\b(\\$\\d+|\\d+\\$)\b/g,
  /\b(earn money|make money)\b/gi,
]

function containsSpamPatterns(content: string): boolean {
  return SPAM_PATTERNS.some(pattern => pattern.test(content))
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

// Rate limiting per user
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  constructor(private config: RateLimitConfig) {}

  canComment(userId: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.config.windowMs
    )
    
    if (validRequests.length >= this.config.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(userId, validRequests)
    return true
  }

  getTimeToWait(userId: string): number {
    const userRequests = this.requests.get(userId) || []
    if (userRequests.length === 0) return 0

    const oldestRequest = userRequests[0]
    const timeToWait = this.config.windowMs - (Date.now() - oldestRequest)
    return Math.max(0, timeToWait)
  }
}

// Create rate limiter instance with default config
export const commentRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 5 // 5 comments per 5 minutes
})
