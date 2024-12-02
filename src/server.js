import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { setupServer } from './index.js';

const logger = pino();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/contacts', contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export function setupServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}
