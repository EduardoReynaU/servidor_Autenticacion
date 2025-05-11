import { GraphQLError } from 'graphql';
import { User } from '../domain/models/User.js';
import { generateJWT } from '../infrastructure/jwt.js';

/**
 * @param {UserRepositoryPort} userRepo
 * @param {OAuthProviderPort} oauthProvider
 */
export const loginUser = (userRepo, oauthProvider) => async ({ authCode, username, password }) => {
  if (authCode) {
    // Login vía GitHub
    const oauthUser = await oauthProvider.getUserData(authCode);
    const { provider, providerId, username, email, avatarUrl, topLanguages } = oauthUser;

    let user = await userRepo.findByProviderId(provider, providerId);

    if (!user) {
      console.log('[🧪] Usuario nuevo por GitHub. Registrando...');
      user = new User({ username, email, provider, providerId, avatarUrl, topLanguages });
      user = await userRepo.create(user);
    } else {
      console.log('[ℹ️] Usuario ya registrado con GitHub.');
    }

    const token = generateJWT(user);
    return { token, user };
  } else {
    // Login tradicional
    const user = await userRepo.findByUsername(username);
    if (!user || !(await userRepo.verifyPassword(user, password))) {
      throw new GraphQLError("Credenciales inválidas", {
        extensions: { code: "INVALID_CREDENTIALS" }
      });
    }

    const token = generateJWT(user);
    return { token, user };
  }
};
