// Book resolvers
const Book = require('../../models/Book');
const Review = require('../../models/Review');
const { GraphQLError } = require('graphql');

const bookResolvers = {
  Query: {
    getBooks: async () => {
      try {
        const books = await Book.find()
          .populate('addedBy')
          .lean();
        const booksWithReviews = await Promise.all(
          books.map(async (book) => {
            const reviews = await Review.find({ bookId: book._id })
              .populate('userId')
              .lean();
            return { ...book, reviews };
          })
        );
        return booksWithReviews;
      } catch (error) {
        throw new GraphQLError('Error fetching books', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    getBook: async (_, { id }) => {
      try {
        const book = await Book.findById(id)
          .populate('addedBy')
          .lean();
        if (!book) {
          return null;
        }
        const reviews = await Review.find({ bookId: id })
          .populate('userId')
          .lean();
        return { ...book, reviews };
      } catch (error) {
        throw new GraphQLError('Error fetching book', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
  Mutation: {
    addBook: async (_, { title, author, description }, context) => {
      try {
        if (!context.user) {
          throw new GraphQLError('You must be logged in to add a book', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        const book = new Book({
          title,
          author,
          description,
          addedBy: context.user.id,
        });
        await book.save();
        await book.populate('addedBy');
        return { ...book.toObject(), reviews: [] };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError('Error adding book', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
  Book: {
    id: (parent) => parent._id || parent.id,
    addedBy: (parent) => ({
      id: parent.addedBy._id,
      username: parent.addedBy.username,
      email: parent.addedBy.email,
      role: parent.addedBy.role,
    }),
  },
};

module.exports = bookResolvers;
