import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import googleSheetRoutes from './routes/googleSheetRoutes';
import userAuthRoutes from './routes/userAuthRoutes';
import { connectDB } from './config/mongoDB';
import courseRoutes from './routes/courseRoutes';

const app = express();

// Connecting to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', googleSheetRoutes);
app.use('/api/user', userAuthRoutes);
app.use('/api/courses', courseRoutes);

// Test route
app.get('/', (req, res) => {
  res.send(`Server is running! Access API at /api ${req.headers}`);
});

export default app;
