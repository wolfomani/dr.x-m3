import express from "express"
import cors from "cors"
import { registerRoutes } from "../server/routes"

const app = express()

// Enable CORS for all routes
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Register API routes
registerRoutes(app)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Export for Vercel serverless functions
export default app
