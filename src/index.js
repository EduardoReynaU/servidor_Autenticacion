import dotenv from 'dotenv';
dotenv.config();

import { startGraphQLServer } from './infrastructure/graphqlServer.js';
import { mongoClient, databaseName } from './infrastructure/database.js';
import { MongoUserRepository } from './adapters/output/database/MongoUserRepository.js';
import { GitHubOAuthAdapter } from './adapters/output/auth/GitHubOAuthAdapter.js';
import { loginUser } from './app/loginUser.js';
import { registerUser } from './app/registerUser.js'; // ✅ Nuevo caso de uso
import { getUserById } from './app/getUserById.js';

// Inyección de dependencias
const userRepo = new MongoUserRepository(mongoClient, databaseName);
const oauthProvider = new GitHubOAuthAdapter({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_REDIRECT_URI 
});

// Casos de uso
const loginUserUseCase = loginUser(userRepo, oauthProvider);
const registerUserUseCase = registerUser(userRepo); // ✅ Registro tradicional y GitHub
const getUserByIdUseCase = getUserById(userRepo);

// Ejecutar servidor con todos los casos de uso
startGraphQLServer({ loginUserUseCase, registerUserUseCase, getUserByIdUseCase });
// startGraphQLServer({ loginUserUseCase, registerUserUseCase }); 