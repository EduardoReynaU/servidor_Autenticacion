// test_insert.js
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://eduardojuanreyna:RkcKzPjFFEAcQSIN@autenservice.rbfipeu.mongodb.net/'); // reemplaza con tu URI real

await client.connect();
const db = client.db('AutenService');
const collection = db.collection('AutenService');

const result = await collection.insertOne({
  username: 'usuario_prueba',
  email: 'prueba@example.com',
  provider: 'github',
  providerId: 'fake123',
  avatarUrl: '',
  topLanguages: ['JavaScript', 'HTML'],
  createdAt: new Date()
});

console.log('Insertado:', result.insertedId);
await client.close();