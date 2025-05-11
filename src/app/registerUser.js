import { GraphQLError } from 'graphql';
import { User } from '../domain/models/User.js';
import { generateJWT } from '../infrastructure/jwt.js';

export const registerUser = (userRepo) => async ({ authCode, input }) => {
  if (authCode) {
    // Registro vía GitHub
    const oauthUser = await oauthProvider.getUserData(authCode);
    const { provider, providerId, username, email, avatarUrl, topLanguages } = oauthUser;

    let user = await userRepo.findByProviderId(provider, providerId);

    if (!user) {
      user = new User({ username, email, provider, providerId, avatarUrl, topLanguages });
      user = await userRepo.create(user);
    }

    const token = generateJWT(user);
    return { token, user };
  } else {
    // Registro tradicional
    const { names, lastName, username, email, password } = input;

    const existingUser = await userRepo.findByUsername(username);  
    if (existingUser) {
      throw new GraphQLError("User already exists", { 
        extensions: { code: "USER_ALREADY_EXISTS" }
      });
    }

    const existingEmail = await userRepo.findByEmail(email);
    if (existingEmail) {
      throw new GraphQLError("Email already registered", {
        extensions: { code: "EMAIL_ALREADY_EXISTS" }
      });
    }

    const newUser = new User({ names, lastName, username, email, password });
    const user = await userRepo.createUserWithPassword(newUser);
    const token = generateJWT(user);
    return { token, user };
  }
};
