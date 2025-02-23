import express from 'express';
import cors from 'cors';
import googleSheetRoutes from './routes/googleSheetRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', googleSheetRoutes);

export default app;