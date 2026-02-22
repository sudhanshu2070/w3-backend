import express from 'express';
import cors from 'cors';
import googleSheetRoutes from './routes/googleSheetRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', googleSheetRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running! Access API at /api');
});

export default app;
