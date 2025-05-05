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

  type Query {
    me(id: ID!): User
  }

  type Mutation {
    loginWithGithub(authCode: String!): User
  }
`;
