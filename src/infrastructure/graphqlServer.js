import express from 'express';
import cors from 'cors'; // ✅ Importa CORS
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from '../adapters/input/graphql/typeDefs.js';
import { userResolver } from '../adapters/input/graphql/resolvers/userResolver.js';
import { connectToDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startGraphQLServer = async (useCases) => {
  await connectToDatabase();

  const app = express();

  // ✅ Permitir todas las solicitudes CORS (para pruebas)
  app.use(cors());

  app.use(express.static(path.join(__dirname, '../../public')));

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ 
      typeDefs,
      resolvers: userResolver(useCases)
    }),
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      return { token }; // Puedes incluir aquí la lógica de validación de token
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/callback', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/dashboard.html'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/graphql`);
  }
  );

};


  