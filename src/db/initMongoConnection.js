import mongoose from 'mongoose';

export function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  const mongoURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;
  mongoose
    .connect(mongoURI)
    .then(() => console.log('Mongo connection successfully established!'))
    .catch((err) => console.error('Mongo connection error:', err));
}
