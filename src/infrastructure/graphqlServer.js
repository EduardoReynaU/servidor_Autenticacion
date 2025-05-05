import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from '../adapters/input/graphql/typeDefs.js';
import { userResolver } from '../adapters/input/graphql/resolvers/userResolver.js';
import { connectToDatabase } from './database.js';

// Necesario si estás usando ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("[INIT] Iniciando servidor...");

export const startGraphQLServer = async (useCases) => {

  console.log("[INIT] startGraphQLServer invocado");
  await connectToDatabase();

  const app = express();
  app.use(express.static(path.join(__dirname, '../../public')));

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ 
      typeDefs,
      resolvers: userResolver(useCases)
    }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/callback', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  const PORT = process.env.PORT || 3000;

  console.log("[BOOT] Iniciando aplicación...");
  app.listen(PORT, () => {
    console.log(`[BOOT] Servidor corriendo en el puerto ${PORT}`);
    console.log(`🚀 Subgraph ready at http://localhost:${PORT}/graphql`);
  });
};
