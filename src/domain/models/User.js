export class User {
    constructor({ id, username, email, provider, providerId, avatarUrl, topLanguages = [] }) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.provider = provider;
      this.providerId = providerId;
      this.avatarUrl = avatarUrl;
      this.topLanguages = topLanguages;
    }
  }
  