import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import googleSheetRoutes from './routes/googleSheetRoutes';
import userAuthRoutes from './routes/userAuthRoutes';

const app = express();

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

// Test route
app.get('/', (req, res) => {
  console.log('Server is running! Access API at /api', req.headers);
  res.send(`Server is running! Access API at /api ${req.headers}`);
});

export default app;
