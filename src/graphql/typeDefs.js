const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    addedBy: User!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String!
    user: User!
    book: Book!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getBooks: [Book!]!
    getBook(id: ID!): Book
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addBook(title: String!, author: String!, description: String!): Book!
    addReview(bookId: ID!, rating: Int!, comment: String!): Review!
    deleteReview(id: ID!): Boolean!
    updateUserRole(userId: ID!, role: String!): User!
  }
`;

module.exports = typeDefs;
