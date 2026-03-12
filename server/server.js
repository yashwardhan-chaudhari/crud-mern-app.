import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS (Lesson 3.4) ────────────────────────────────────────────────────────
// Allows frontend at CLIENT_URL to make cross-origin requests
// credentials:true enables cookies and Authorization headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
// Health check endpoint (used in ConnectionTest component)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!', timestamp: new Date() });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// MUST be last — after all routes
// The 4-parameter signature (err, req, res, next) tells Express this is error middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
