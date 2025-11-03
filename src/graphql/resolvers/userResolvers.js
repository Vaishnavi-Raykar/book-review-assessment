// User resolvers
const User = require('../../models/User');
const { generateToken } = require('../../utils/auth');
const { GraphQLError } = require('graphql');

const userResolvers = {
  Mutation: {
    register: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });
        if (existingUser) {
          throw new GraphQLError('User already exists with this email or username', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        const user = new User({
          username,
          email,
          password,
          role: 'user',
        });
        await user.save();
        const token = generateToken(user);
        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Error registering user', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        const token = generateToken(user);
        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Error logging in', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Admin only: update a user's role
    updateUserRole: async (_, { userId, role }, context) => {
      try {
        // Only allow admins to update roles
        if (!context.user || context.user.role !== 'admin') {
          throw new GraphQLError('You are not authorized to update user roles', {
            extensions: { code: 'FORBIDDEN' },
          });
        }
        // Only allow valid roles
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
          throw new GraphQLError('Invalid role', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        const user = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true }
        );
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Error updating user role', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
  User: {
    id: (parent) => parent._id || parent.id,
  },
};

module.exports = userResolvers;
