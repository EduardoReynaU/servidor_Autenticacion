export const userResolver = ({ loginUserUseCase, registerUserUseCase, getUserByIdUseCase }) => ({
  User: {
    __resolveReference: async (reference) => {
      return await getUserByIdUseCase(reference.id);
    }
  },
  Query: {
    me: async (_, { id }) => {
      return await getUserByIdUseCase(id);
    }
  }, 
  Mutation: {
    // Nuevo login que maneja tanto tradicional como GitHub (según input)
    loginUser: async (_, { input }) => {
      const { token, user } = await loginUserUseCase({input});
      return { token, user };
    },

    // Registro general, maneja tradicional y GitHub
    registerUser: async (_, { input }) => {
      console.log('🚀 ~ Input recibido en registerUser:', input);
    
      try {
        const { token, user } = await registerUserUseCase({input});
        console.log('🚀 ~ Token y User generados:', token, user);
        return { token, user };
      } catch (error) {
        console.error('❌ Error en registerUserUseCase:', error);
        throw error; // Esto permitirá que GraphQL devuelva el error de forma estándar
      }
    },

    // Si prefieres mantener login exclusivo de GitHub también lo dejamos
    loginWithGithub: async (_, { authCode }) => {
      const { token, user } = await loginUserUseCase({ authCode });
      return { token, user };
    }
  }
});
