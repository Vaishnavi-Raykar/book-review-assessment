require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { getUserFromToken } = require('./utils/auth');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Get token from Authorization header
    const token = req.headers.authorization || '';
    
    // Get user from token
    const user = getUserFromToken(token);
    
    // Return context with user
    return { user };
  },
  csrfPrevention: true,
  cache: 'bounded',
});

// Start server
const startServer = async () => {
  await server.start();
  
  // Apply Apollo middleware to Express
  server.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server live -  http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
