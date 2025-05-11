import { gql } from 'graphql-tag';

export const typeDefs = gql`
  directive @key(fields: String!) on OBJECT | INTERFACE

  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String
    provider: String!
    providerId: String!
    avatarUrl: String
    topLanguages: [String!]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginInput {
    authCode: String
    username: String
    password: String
  }

  input RegisterInput {
    authCode: String
    names: String
    lastName: String
    username: String
    email: String
    password: String
  }

  type Query {
    me(id: ID!): User
  }

  type Mutation {
    # Login general: puede ser tradicional o por GitHub (según input recibido)
    loginUser(input: LoginInput!): AuthPayload!

    # Registro general: tradicional o por GitHub
    registerUser(input: RegisterInput!): AuthPayload!

    # Si quieres conservar login exclusivo de GitHub
    loginWithGithub(authCode: String!): AuthPayload!
  }
`;
