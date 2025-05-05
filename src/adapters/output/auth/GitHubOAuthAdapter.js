import axios from 'axios';
import { OAuthProviderPort } from '../../../domain/ports/OAuthProviderPort.js';

export class GitHubOAuthAdapter extends OAuthProviderPort {
  constructor({ clientId, clientSecret, redirectUri }) {
    super();
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async getUserData(authCode) {
    try {
      // Paso 1: Obtener el access_token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: authCode,
          redirect_uri: this.redirectUri
        },
        { headers: { Accept: 'application/json' } }
      );
  
      const accessToken = tokenResponse.data.access_token;
  
      // Paso 2: Obtener perfil del usuario
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      const { id, login, email, avatar_url } = userResponse.data;
  
      // Paso 3: Obtener repos públicos
      const reposResponse = await axios.get(`https://api.github.com/users/${login}/repos`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      const languageCount = {};
      for (const repo of reposResponse.data) {
        const lang = repo.language;
        if (lang) languageCount[lang] = (languageCount[lang] || 0) + 1;
      }
  
      const topLanguages = Object.entries(languageCount)
        .sort((a, b) => b[1] - a[1])
        .map(([lang]) => lang)
        .slice(0, 3);
  
      return {
        provider: 'github',
        providerId: id.toString(),
        username: login,
        email: email || null,
        avatarUrl: avatar_url,
        topLanguages
      };
    } catch (error) {
      console.error('[GitHubOAuthAdapter] Error:', error.message);
      throw new Error('Error en la autenticación con GitHub');
    }
  }
  
}
