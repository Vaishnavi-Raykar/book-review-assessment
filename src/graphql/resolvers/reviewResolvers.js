// Review resolvers
const Review = require('../../models/Review');
const Book = require('../../models/Book');
const { GraphQLError } = require('graphql');

const reviewResolvers = {
  Mutation: {
    addReview: async (_, { bookId, rating, comment }, context) => {
      try {
        if (!context.user) {
          throw new GraphQLError('You must be logged in to add a review', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        const book = await Book.findById(bookId);
        if (!book) {
          throw new GraphQLError('Book not found', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        if (rating < 1 || rating > 5) {
          throw new GraphQLError('Rating must be between 1 and 5', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        const review = new Review({
          rating,
          comment,
          bookId,
          userId: context.user.id,
        });
        await review.save();
        await review.populate('userId');
        await review.populate('bookId');
        return review;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Error adding review', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    deleteReview: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new GraphQLError('You must be logged in to delete a review', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        const review = await Review.findById(id);
        if (!review) {
          throw new GraphQLError('Review not found', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        // Allow admins to delete any review, or the review owner to delete their own
        if (context.user.role !== 'admin' && review.userId.toString() !== context.user.id) {
          throw new GraphQLError('You are not authorized to delete this review', {
            extensions: { code: 'FORBIDDEN' },
          });
        }
        await Review.findByIdAndDelete(id);
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Error deleting review', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
  Review: {
    id: (parent) => parent._id || parent.id,
    user: (parent) => ({
      id: parent.userId._id,
      username: parent.userId.username,
      email: parent.userId.email,
      role: parent.userId.role,
    }),
    book: (parent) => ({
      id: parent.bookId._id,
      title: parent.bookId.title,
      author: parent.bookId.author,
      description: parent.bookId.description,
    }),
  },
};

module.exports = reviewResolvers;
