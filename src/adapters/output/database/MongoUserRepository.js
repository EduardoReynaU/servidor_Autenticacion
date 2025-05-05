import { ObjectId } from 'mongodb';
import { UserRepositoryPort } from '../../../domain/ports/UserRepositoryPort.js';
import { User } from '../../../domain/models/User.js';

export class MongoUserRepository extends UserRepositoryPort {
  constructor(mongoClient, dbName) {
    super();
    this.collection = mongoClient.db(dbName).collection('AutenService');
  }

  async findByProviderId(provider, providerId) {
    const doc = await this.collection.findOne({ provider, providerId });
    return doc ? new User({ ...doc, id: doc._id }) : null;
  }

  async create(user) {
    const userData = {
      username: user.username,
      email: user.email,
      provider: user.provider,
      providerId: user.providerId,
      avatarUrl: user.avatarUrl,
      topLanguages: user.topLanguages || []
    };

    console.log('[📝] Guardando en MongoDB:', userData);

    const { insertedId } = await this.collection.insertOne(userData);

    console.log('[✅] Usuario guardado con ID:', insertedId.toString());

    return new User({ ...userData, id: insertedId });
  }

  async findById(id) {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? new User({ ...doc, id: doc._id }) : null;
  }
}
