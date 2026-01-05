import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { logger } from './middleware/logger.middleware.js';
import { router } from './api/router.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);

// Routes
app.use('/api', router);

// Error Handling
app.use(errorMiddleware);

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
