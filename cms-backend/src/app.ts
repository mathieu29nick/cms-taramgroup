import express from 'express';
import cors from 'cors';

// ROUTES
import articleRoutes from './routes/article.routes';
import categoryRoutes from './routes/category.routes';
import networkRoutes from './routes/network.routes';
import notificationRoutes from './routes/notification.routes';
import importRoutes from './routes/import.routes';

import { mockAuth } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// GLOBAL MIDDLEWARES
app.use(cors());
app.use(express.json());

// AUTH
app.use(mockAuth);

// ROUTES
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/import', importRoutes);

// HEALTH CHECK
app.get('/api/health', (_, res) => {
  res.json({ status: 'OK' });
});

// ERROR HANDLER
app.use(errorHandler);

export default app;