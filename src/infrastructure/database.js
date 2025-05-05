import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'authdb';

export const mongoClient = new MongoClient(uri);
export const databaseName = dbName;

export const connectToDatabase = async () => {
  if (!mongoClient.isConnected?.()) {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
  }
};
