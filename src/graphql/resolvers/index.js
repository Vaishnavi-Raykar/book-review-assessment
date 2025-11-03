
const { merge } = require('lodash');
const userResolvers = require('./userResolvers');
const bookResolvers = require('./bookResolvers');
const reviewResolvers = require('./reviewResolvers');

// Merge all resolvers into one object
const resolvers = merge({}, userResolvers, bookResolvers, reviewResolvers);

module.exports = resolvers;
