import express from 'express';
import cors from 'cors';
import pino from 'pino';

const logger = pino();
const app = express();

app.use(cors());
app.use(express.json());

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export function setupServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}
