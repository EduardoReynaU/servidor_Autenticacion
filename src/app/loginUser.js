import { User } from '../domain/models/User.js';

/**
 * @param {UserRepositoryPort} userRepo - Implementación del repositorio de usuarios
 * @param {OAuthProviderPort} oauthProvider - Implementación del proveedor OAuth
 */
export const loginUser = (userRepo, oauthProvider) => async (authCode) => {
  const oauthUser = await oauthProvider.getUserData(authCode);
  const { provider, providerId, username, email, avatarUrl, topLanguages } = oauthUser;

  let user = await userRepo.findByProviderId(provider, providerId);

  if (!user) {
    console.log('[🧪] Usuario nuevo detectado. Se procederá a registrar.');
    user = new User({ username, email, provider, providerId, avatarUrl, topLanguages });
    user = await userRepo.create(user);
  } else {
    console.log('[ℹ️] Usuario ya registrado. Se omite guardado.');
  }

  return user;
};