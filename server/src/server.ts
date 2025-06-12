import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import authMiddleware from './middleware/authMiddleware';
import todoRouter from './routes/todoRouter';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/todos', authMiddleware, todoRouter);

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
