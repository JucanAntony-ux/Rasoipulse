import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/demo
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"]
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount API routes under /api
app.use("/api", apiRoutes);

// Root health check endpoint
app.get("/", (req, res) => {
  res.json({
    app: "RasoiPulse Backend API",
    status: "online",
    docs: "/api/health",
    version: "1.0.0"
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      error: `Upload Error: ${err.message}`
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🍛 RasoiPulse Decision Engine API listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

export default app;
