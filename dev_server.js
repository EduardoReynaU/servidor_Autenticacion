import express from 'express';

const app = express();

app.get('/callback', (req, res) => {
  const authCode = req.query.code;
  res.send(`
    <h2>AuthCode recibido:</h2>
    <p><code>${authCode}</code></p>
    <p>Envíalo en GraphQL:</p>
    <pre>
mutation {
  loginWithGithub(authCode: "${authCode}") {
    id
    username
    email
    provider
    avatarUrl
  }
}
    </pre>
  `);
});

app.listen(3000, () => {
  console.log('Servidor temporal en http://localhost:3000');
});
