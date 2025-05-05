export const userResolver = ({ loginUserUseCase, getUserByIdUseCase }) => ({
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
      loginWithGithub: async (_, { authCode }) => {
        return await loginUserUseCase(authCode);
      }
    }
  });
  