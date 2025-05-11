import { ObjectId } from 'mongodb';
import { UserRepositoryPort } from '../../../domain/ports/UserRepositoryPort.js';
import { User } from '../../../domain/models/User.js';

export class MongoUserRepository extends UserRepositoryPort {
  constructor(mongoClient, dbName) {
    super();
    this.collection = mongoClient.db(dbName).collection('users');
  }

  async findByProviderId(provider, providerId) {
    const doc = await this.collection.findOne({ provider, providerId });
    return doc ? new User({ ...doc, id: doc._id }) : null;
  }

  async findByUsername(username) {
    const doc = await this.collection.findOne({ username });
    return doc ? new User({ ...doc, id: doc._id }) : null;
  }

  async findByEmail(email) {
    const doc = await this.collection.findOne({ email });
    return doc ? new User({ ...doc, id: doc._id }) : null;
  }

  async createUserWithPassword(user) {
    const userData = {
      username: user.username,
      email: user.email,
      provider: 'local',
      providerId: null,
      avatarUrl: null,
      topLanguages: [],
      password: user.password // Se almacena directamente (no encriptado)
    };
  
    const { insertedId } = await this.collection.insertOne(userData);
    console.log('[✅] Usuario creado con contraseña. ID:', insertedId.toString());
    return new User({ ...userData, id: insertedId });
  }
  

  async create(user) {
    const userData = {
      username: user.username,
      email: user.email,
      provider: user.provider || 'local',
      providerId: user.providerId || null,
      avatarUrl: user.avatarUrl || null,
      topLanguages: user.topLanguages || [],
      password: user.password || null // Guardamos en texto plano
    };

    console.log('[📝] Guardando en MongoDB:', userData);

    const { insertedId } = await this.collection.insertOne(userData);
    console.log('[✅] Usuario guardado con ID:', insertedId.toString());

    return new User({ ...userData, id: insertedId });
  }

  async verifyPassword(user, plainPassword) {
    if (!user.password) return false;
    return user.password === plainPassword;
  }

  async findById(id) {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? new User({ ...doc, id: doc._id }) : null;
  }
}
