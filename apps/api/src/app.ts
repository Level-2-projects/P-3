import express from "express";

export const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); 

// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({
    status: "ok",
  });
});